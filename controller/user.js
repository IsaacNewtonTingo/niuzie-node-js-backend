const bcrypt = require("bcrypt");

const User = require("../models/user");
const PendingUserVerification = require("../models/pending-user-verification");

const credentials = {
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USER_NAME,
};

const AfricasTalking = require("africastalking")(credentials);

exports.signup = async (req, res) => {
  let { firstName, lastName, phoneNumber, password, confirmPassword } =
    req.body;

  firstName = firstName.trim();
  lastName = lastName.trim();
  phoneNumber = phoneNumber.toString().trim();
  password = password.trim();
  confirmPassword = password.trim();

  const phoneNumberRegex = new RegExp(
    "^(?:254|\\+254|0)?(7(?:(?:[12][0-9])|(?:0[0-8])|(?:9[0-2]))[0-9]{6})$"
  );

  if (!firstName) {
    res.json({
      status: "Failed",
      message: "First name is required",
    });
  } else if (!lastName) {
    res.json({
      status: "Failed",
      message: "Last name is required",
    });
  } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
    res.json({
      status: "Failed",
      message: "Invalid name format",
    });
  } else if (!phoneNumber) {
    res.json({
      status: "Failed",
      message: "Phone number is required",
    });
  }
  // else if (!phoneNumberRegex.test(phoneNumber)) {
  //   res.json({
  //     status: "Failed",
  //     message: "Invalid phone number",
  //   });
  // }
  else if (password.length < 8) {
    res.json({
      status: "Failed",
      message: "Password is too short",
    });
  } else {
    //check if phone number is already registered
    await User.findOne({ phoneNumber }).then(async (response) => {
      if (response) {
        res.json({
          status: "Failed",
          message: "Phone number is already registered",
        });
      } else {
        //send verification code
        sendVerificationCode(req.body, res);
      }
    });
  }
};

const sendVerificationCode = async ({ phoneNumber }, res) => {
  const toPhoneNumber = `+${phoneNumber}`;
  //check if there was an initial record
  await PendingUserVerification.findOneAndDelete({ phoneNumber })
    .then(async () => {
      let verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
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
          await pendingVerification
            .save()
            .then(async () => {
              //send code

              const sms = AfricasTalking.SMS;
              const options = {
                to: toPhoneNumber,
                message: `Hello, here is your verification code : ${verificationCode}`,
                // from: "Party finder",
              };

              await sms
                .send(options)
                .then((response) => {
                  res.json({
                    status: "Success",
                    messsage: `Verification code sent. Please verify your phone number to finish registration process. Code expires in 1hr`,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: "Failed",
                    message:
                      "Error occured while sending verification code. Please try again later",
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "Failed",
                message: "Error occured while saving pending verification",
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: "Failed",
            message: "Error occured while hashing verification code",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "Failed",
        message: "Error occured while searching pending verification records",
      });
    });
};

exports.verifyCode = async (req, res) => {
  let { verificationCode, firstName, lastName, phoneNumber, password } =
    req.body;

  verificationCode.trim();

  await PendingUserVerification.findOne({ phoneNumber }).then(
    async (pendingRecordResponse) => {
      if (!pendingRecordResponse) {
        //no code record found
        res.json({
          status: "Failed",
          message: "Verification code has expired. Please request for another",
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
              await bcrypt
                .hash(password, 10)
                .then(async (hashedPassword) => {
                  //create user

                  const newUser = new User({
                    firstName,
                    lastName,
                    phoneNumber,
                    password: hashedPassword,
                    profilePicture: "",
                    verified: true,
                  });

                  await newUser
                    .save()
                    .then(async () => {
                      //delete record
                      await pendingRecordResponse.delete().then(() => {
                        res.json({
                          status: "Success",
                          message:
                            "Code verified successfully. You can now login",
                        });
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.json({
                        status: "Failed",
                        message: "An error occured while saving user records",
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: "Failed",
                    message: "An error occured while hashing password",
                  });
                });
            } else {
              //wrong code
              res.json({
                status: "Failed",
                message: "Invalid verification code entered",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: "Failed",
              message: "An error occured while comparing the codes",
            });
          });
      }
    }
  );
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
        res.json({
          status: "Success",
          message: "Login successfull",
          data: { userID: user._id },
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
