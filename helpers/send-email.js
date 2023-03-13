const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.ZAMARA_EMAIL_SENDER,
    pass: process.env.ZAMRA_EMAIL_PASSWORD,
  },
});

exports.sendZamaraEmail = async (req, res) => {
  try {
    //delete existing
    const { message, subject, email } = req.body;

    const mailOptions = {
      from: `Zamara ${process.env.ZAMARA_EMAIL_SENDER}`,
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
