import nodemailer from 'nodemailer'

interface options {
  to: string
  subject: string
  message: string
}

export const sendEmail = async (options: options) => {
  const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.message,
  }

  const mail = await mailer.sendMail(message)

  console.log('Message sent: %s', mail.response)
}
