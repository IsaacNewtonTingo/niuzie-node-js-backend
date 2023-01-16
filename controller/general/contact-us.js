const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

exports.contactUs = async (req, res) => {
  const { email, message, name } = req.body;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: "newtontingo@gmail.com",
    subject: "Customer support",
    html: `<p>
                <strong>Name: ${name}</strong><br/>
                <strong>Email: ${email}</strong><br/>
                <strong>Message: ${message}</strong><br/>
            </p>`,
  };

  await transporter.sendMail(mailOptions).then(() => {
    res.json({
      status: "Success",
      message: "sent successfully",
    });
  });
};
