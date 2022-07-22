import nodemailer from 'nodemailer';
import 'dotenv/config';

let tranporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAILER_ID,
    pass: process.env.GOOGLE_MAILER_PW,
  },
});

async function mailer(email, randomNumber) {
  const info = await tranporter.sendMail({
    from: process.env.GMAIL_MAILER_ID,
    to: email,
    subject: '비밀번호 변경',
    html: `<a href="http://localhost:5000/api/findPW/${randomNumber}">링크열기</a>`,
  });
  return info;
}

export { mailer };
