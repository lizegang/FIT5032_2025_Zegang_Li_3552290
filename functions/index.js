const functions = require('firebase-functions')
const admin = require('firebase-admin')
const sgMail = require('@sendgrid/mail')

// 初始化Firebase Admin
admin.initializeApp()

// 配置SendGrid
sgMail.setApiKey(functions.config().sendgrid.api_key)

// 发送单封邮件的云函数
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // 验证用户是否已认证
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    )
  }

  const { to, subject, content, attachment } = data

  // 验证输入
  if (!to || !subject || !content) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required email parameters.')
  }

  try {
    const msg = {
      to,
      from: functions.config().sendgrid.sender_email,
      subject,
      html: content,
      ...(attachment && { attachments: [attachment] }),
    }

    const result = await sgMail.send(msg)
    return { success: true, messageId: result[0].headers['x-message-id'] }
  } catch (error) {
    console.error('Email sending error:', error)
    throw new functions.https.HttpsError('internal', 'Failed to send email: ' + error.message)
  }
})

// 发送批量邮件的云函数
exports.sendBulkEmail = functions.https.onCall(async (data, context) => {
  // 验证用户是否已认证且是管理员
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    )
  }

  // 检查用户是否为管理员
  const user = await admin.auth().getUser(context.auth.uid)
  const userDoc = await admin.firestore().collection('users').doc(user.uid).get()

  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can send bulk emails.')
  }

  const { recipients, subject, content } = data

  // 验证输入
  if (!recipients || !recipients.length || !subject || !content) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required email parameters.')
  }

  try {
    const messages = recipients.map((recipient) => ({
      to: recipient,
      from: functions.config().sendgrid.sender_email,
      subject,
      html: content,
    }))

    // 分批次发送，避免超出SendGrid限制
    const batchSize = 100
    const results = []

    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize)
      const result = await sgMail.send(batch)
      results.push(...result)
    }

    return {
      success: true,
      count: results.length,
      messageIds: results.map((r) => r.headers['x-message-id']),
    }
  } catch (error) {
    console.error('Bulk email sending error:', error)
    throw new functions.https.HttpsError('internal', 'Failed to send bulk emails: ' + error.message)
  }
})

// 获取用户列表的API端点
exports.getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore().collection('users').get()
    const users = []

    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// 获取事件列表的API端点
exports.getEvents = functions.https.onRequest(async (req, res) => {
  try {
    const eventsSnapshot = await admin.firestore().collection('events').get()
    const events = []

    eventsSnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    res.status(200).json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})
