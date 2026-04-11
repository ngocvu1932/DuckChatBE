import nodemailer from 'nodemailer';

const sendMail = async (to, subject, text) => {
  try {
    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Dịch vụ email (ví dụ: Outlook, Yahoo)
      auth: {
        user: process.env.EMAIL_SERVICE, // email gửi
        pass: process.env.EMAIL_PASSWORD, // mật khẩu ứng dụng của email gửi
      },
    });

    // Nội dung email
    const mailOptions = {
      from: process.env.EMAIL_SERVICE, // Email gửi
      to, // Email nhận
      subject, // Tiêu đề email
      text, // Nội dung email (dạng text)
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendMail;
