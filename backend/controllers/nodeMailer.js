const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  const { userEmail, messageContent, itemImage, subject } = req.body;

  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.ID,
        pass: process.env.PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);

    //   const htmlContent = `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Welcome to Our Organization</title>
    //   </head>
    //   <body>
    //     <div style="background-color: #f0f0f0; padding: 20px;">
    //       <h2 style="color: #333;">Welcome to Our Organization!</h2>
    //       <p style="color: #666;">Below are your account details:</p>
    //       <p style="color: #666;"><strong>Email:</strong> ${userEmail}</p>
    //       <p style="color: #666;"><strong>Password:</strong> ${password}</p>
    //       <p style="color: #666;">You can log in to our site using the following link:</p>
    //       <a href="http://localhost:3000/login">Log in</a>
    //       <p style="color: #666;">Once logged in, you can reset your password.</p>
    //       <p style="color: #666;">Best regards,<br>Your Organization Team</p>
    //     </div>
    //   </body>
    //   </html>
    // `;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>StockWise Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #333;">StockWise Notification</h1>
          <p style="color: #555;">Hello,</p>
          <p style="color: #555;">This is a notification from StockWise. You have received a new update or alert.</p>
          <p style="color: #555;">${messageContent}</p>
          <img src=${itemImage} alt="Asset Image" style="max-width: 100%; height: auto; margin-bottom: 10px;">
          <p style="color: #555;">For more details, please visit StockWise.</p>
          <p style="color: #555;">Thank you,</p>
          <p style="color: #555;">The StockWise Team</p>
      </div>
    </body>
    </html>`;

    let message = {
      // from: "stockwise0@gmail.com",
      from: process.env.ID,
      to: userEmail,
      subject: subject || "Stockwise Notification",
      html: htmlContent,
    };

    const info = await transporter.sendMail(message);
    
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

module.exports = sendMail;
