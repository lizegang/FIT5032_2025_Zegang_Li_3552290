// eslint-disable-next-line no-unused-vars
import { getFunctions, httpsCallable } from 'firebase/functions'
import { functions } from '@/firebase/config'

// 使用云函数发送单封邮件
export const sendEmail = async (emailData) => {
  try {
    const response = await fetch('https://<your-alibaba-cloud-fc-endpoint>/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    if (result.success) {
      console.log('Email sent successfully:', result.messageId)
    } else {
      console.error('Error sending email:', result.error)
    }
  } catch (error) {
    console.error('Error sending email:', error)
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
