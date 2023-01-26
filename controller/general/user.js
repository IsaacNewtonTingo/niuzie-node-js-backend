const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const User = require("../../models/general/user");
const PendingUserVerification = require("../../models/admin/pending-user-verification");
const {
  EmailVerification,
} = require("../../models/admin/pending-email-verifications");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const credentials = {
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USER_NAME,
};

const AfricasTalking = require("africastalking")(credentials);

exports.signup = async (req, res) => {
  var { phoneNumber, email } = req.body;

  email = email.trim();
  phoneNumber = phoneNumber.toString().trim();

  try {
    //check if phone number is already registered
    await User.findOne({
      $or: [{ email, phoneNumber }],
    }).then(async (response) => {
      if (response) {
        res.json({
          status: "Failed",
          message: "Phone number or email provided is already registered",
        });
      } else {
        //send verification code
        sendVerificationCode(req.body, res);
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while signing up",
    });
  }
};

const sendVerificationCode = async ({ phoneNumber }, res) => {
  try {
    const toPhoneNumber = `+${phoneNumber}`;
    //check if there was an initial record
    await PendingUserVerification.findOneAndDelete({ phoneNumber }).then(
      async () => {
        let verificationCode = Math.floor(
          1000 + Math.random() * 9000
        ).toString();
        //encrypt code
        await bcrypt
          .hash(verificationCode, 10)
          .then(async (encryptedVerificationCode) => {
            //add pending verification
            const pendingVerification = new PendingUserVerification({
              phoneNumber,
              verificationCode: encryptedVerificationCode,
              createdAt: Date.now(),
            });
            await pendingVerification.save().then(async () => {
              //send code

              const sms = AfricasTalking.SMS;
              const options = {
                to: toPhoneNumber,
                message: `Hello, here is your verification code : ${verificationCode}`,
                // from: "Party finder",
              };

              await sms.send(options).then(() => {
                res.json({
                  status: "Success",
                  messsage: `Verification code sent. Please verify your phone number to finish registration process. Code expires in 1hr`,
                });
              });
            });
          });
      }
    );
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while sending verification code",
    });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    let {
      verificationCode,
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      county,
      subCounty,
    } = req.body;

    verificationCode.trim();

    await PendingUserVerification.findOne({ phoneNumber }).then(
      async (pendingRecordResponse) => {
        if (!pendingRecordResponse) {
          //no code record found
          res.json({
            status: "Failed",
            message:
              "Verification code has expired. Please request for another",
          });
        } else {
          //compare the code
          const encryptedCode = pendingRecordResponse.verificationCode;

          await bcrypt
            .compare(verificationCode, encryptedCode)
            .then(async (response) => {
              if (response) {
                //code is correct
                //hash password
                await bcrypt.hash(password, 10).then(async (hashedPassword) => {
                  //create user

                  const newUser = new User({
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    password: hashedPassword,
                    profilePicture: "",
                    county: "",
                    subCounty: "",
                  });

                  await newUser.save().then(async () => {
                    //delete record
                    await pendingRecordResponse.delete().then(() => {
                      sendEmailVerificationCode(email, res);
                    });
                  });
                });
              } else {
                //wrong code
                res.json({
                  status: "Failed",
                  message: "Invalid verification code entered",
                });
              }
            });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while verifying code",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      //user not found
      res.json({
        status: "Failed",
        message: "No user found with the given phone number. Please sign up",
      });
    } else {
      //user found
      //compare passwords
      const hashedPassword = user.password;
      const validUser = await bcrypt.compare(password, hashedPassword);
      if (!validUser) {
        //wrong password
        res.json({
          status: "Failed",
          message: "Wrong password. Please try again",
        });
      } else {
        //correct password
        //send token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.json({
          status: "Success",
          message: "Login successfull",
          data: {
            userID: user._id,
            admin: user.admin,
            premium: user.premium,
            token: token,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

//send email verification code
const sendEmailVerificationCode = async (email, res) => {
  try {
    const emailVerificationtionCode = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    const hashedCode = await bcrypt.hash(emailVerificationtionCode, 10);

    const newPendingRecord = new EmailVerification({
      email,
      verificationCode: hashedCode,
    });

    await newPendingRecord.save();

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p><strong>${emailVerificationtionCode}</strong></p>`,
    };

    await transporter.sendMail(mailOptions).then(() => {
      res.json({
        status: "Success",
        message: "Phone number verified successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

//verify email
exports.verifyEmail = async (req, res) => {
  try {
    var { email, verificationCode, userID } = req.body;
    //check if email is already verified
    const user = await User.findOne({ _id: userID });
    if (user.emailVerified == true) {
      res.json({
        status: "Failed",
        message: "Email already verified",
      });
    } else {
      const verification = await EmailVerification.findOne({ email });
      if (!verification) {
        res.json({
          status: "Failed",
          message: "Verification code has expired. Please request another",
        });
      } else {
        const hashedCode = verification.verificationCode;
        const validCode = bcrypt.compare(verificationCode, hashedCode);

        if (validCode) {
          await User.findOneAndUpdate({ email }, { emailVerified: true });
          verification.deleteOne({ email });
          res.json({
            status: "Success",
            message: "Email verified successfully",
          });
        } else {
          res.json({
            status: "Failed",
            message: "Invalid verification code",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while verifying email",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userID = req.params.id;

    const user = await User.findOne({ _id: userID });
    if (user) {
      res.json({
        status: "Success",
        message: "User data retrieved successfully",
        data: user,
      });
    } else {
      res.json({
        status: "Failed",
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while retrieving user data",
    });
  }
};
