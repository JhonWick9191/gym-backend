const nodemailer = require('nodemailer');

// Function to send emails using Nodemailer
const sendEmail = async ({ to, subject, text }) => {
    try {
        // Create a transporter using SMTP configuration from .env
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            family:4
        });

        // Define the email options
        const mailOptions = {
            from: `"Gym Management" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Email Error: ${error.message}`);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
