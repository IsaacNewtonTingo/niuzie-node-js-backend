const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

exports.sendZamaraEmail = async (req, res) => {
  try {
    //delete existing
    const { message, subject, email } = req.body;

    const mailOptions = {
      from: `Zamara ${process.env.AUTH_EMAIL}`,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      status: "Success",
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while trying to send email",
    });
  }
};
