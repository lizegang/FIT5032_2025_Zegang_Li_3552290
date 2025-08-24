// eslint-disable-next-line no-unused-vars
import { getFunctions, httpsCallable } from 'firebase/functions'
import { functions } from '@/firebase/config'

// 使用云函数发送单封邮件
export const sendEmail = async (to, subject, content, attachment = null) => {
  try {
    const sendEmailFunction = httpsCallable(functions, 'sendEmail')
    const result = await sendEmailFunction({
      to,
      subject,
      content,
      attachment,
    })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// 使用云函数发送批量邮件
export const sendBulkEmail = async (recipients, subject, content) => {
  try {
    const sendBulkEmailFunction = httpsCallable(functions, 'sendBulkEmail')
    const result = await sendBulkEmailFunction({
      recipients,
      subject,
      content,
    })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error sending bulk emails:', error)
    return { success: false, error: error.message }
  }
}
