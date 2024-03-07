const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

// const sendMail = async (req, res) => {

//   let testAccount = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // Use `true` for port 465, `false` for all other ports
//     auth: {
//       user: "maddison53@ethereal.email",
//       pass: "jn7jnAPss4f63QBp6D",
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"Rutik Gagare" <rutik@gmail.com>', // sender address
//     to: "rutikgagare4328@gmail.com", // list of receivers
//     subject: "Hello", // Subject line
//     text: "Hello", // plain text body
//     html: "<b>Hello</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   res.json({
//     msg:"You should recieve mail",
//     info:info,
//     preview: nodemailer.getTestMessageUrl(info)
//   });
// };

const sendMail = async (req, res) => {
  let config = {
    service: "gmail",
    auth: {
      user: "stockwise0@gmail.com",
      password: "jlmjbcqeccvvllyd",
    },
  };

  const transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: "Daily Tuition",
      intro: "Your bill has arrived!",
      table: {
        data: [
          {
            item: "Nodemailer Stack Book",
            description: "A Backend application",
            price: "$10.99",
          },
        ],
      },
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: "stockwise0@gmail.com",
    to: 'rutikgagare091971@gmail.com',
    subject: "Place Order",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

module.exports = sendMail;
