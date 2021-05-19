const authHelper = require("./auth");
const nodemailer = require("nodemailer");

const API_ROUTE_CONFIRM_EMAIL = "http://localhost:3000/api/v1/confirm-email/";
async function sendConfirmEmail(user) {
  let token = authHelper.signEmailToken(user);
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"AdoPETme" <no-reply@adopet.me>', // sender address
    to: `"${user.first_name}" <${user.email}>`, // list of receivers
    subject: "Confirmação de email", // Subject line
    text: `Acesse ${API_ROUTE_CONFIRM_EMAIL}${token}`, // plain text body
    html: `
        <h1> Confirme seu email </h1>
        <a href="${API_ROUTE_CONFIRM_EMAIL}${token}">Clique aqui</a>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// sendConfirmEmail().catch(console.error);

module.exports = { sendConfirmEmail };
