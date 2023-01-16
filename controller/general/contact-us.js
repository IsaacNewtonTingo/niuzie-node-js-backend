const nodemailer = require("nodemailer");
const ContactUs = require("../../models/general/contact-us");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

exports.contactUs = async (req, res) => {
  const { email, phoneNumber, message, fullName, user } = req.body;

  const newContactUs = new ContactUs({
    user,
    message,
  });

  await newContactUs.save();

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: "newtontingo@gmail.com",
    subject: "Customer support",
    html: `<p>
                <strong>Name: ${fullName}</strong><br/>
                <strong>Email: ${email}</strong><br/>
                <strong>Phone number: ${phoneNumber}</strong><br/>
                <strong>Message: ${message}</strong><br/>
            </p>`,
  };

  await transporter.sendMail(mailOptions).then(() => {
    res.json({
      status: "Success",
      message: "Sent successfully",
    });
  });
};
