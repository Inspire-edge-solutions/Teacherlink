import nodemailer from 'nodemailer';
import { getSecrets } from './secrets.js';

async function sendEmail(to, subject, htmlBody) {
    try {
        const emailSecrets = await getSecrets("inspireedge", "ap-south-1");
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailSecrets.email,
                pass: emailSecrets["app-password"]
            }
        });

        const mailOptions = {
            from: {
                name: 'TeacherLink',
                address: emailSecrets.email
            },
            to: to,
            subject: subject,
            html: htmlBody
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
}

export { sendEmail };