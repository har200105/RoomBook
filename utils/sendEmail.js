import nodemailer from 'nodemailer';

const sendEmail = async options => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.STMP_FROM_NAME} < ${process.env.STMP_FROM_EMAIL} >`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message)

}

export default sendEmail;