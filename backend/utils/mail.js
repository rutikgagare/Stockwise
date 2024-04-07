const nodemailer = require("nodemailer");

const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL_ID,
    pass: process.env.SENDER_EMAIL_APP_PASSWORD,
  },
});

async function sendMail(name, to, subject, text, html) {
    console.log("name, to, subject, text, html", name, to, subject, text, html)
  const info = await transporter.sendMail({
    from: `${name} <${process.env.SENDER_EMAIL_ID}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info)
}

module.exports = { sendMail }