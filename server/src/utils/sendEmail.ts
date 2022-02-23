const nodemailer = require('nodemailer')

interface options {
	to: string
	subject: string
	message: string
}

// export const sendEmail = async (options: options ) => {
//     const mailer = nodemailer.createTransport({
//         host:
//         port:
//         auth: {
//             user:
//             pass:
//         }
//     })
// }
