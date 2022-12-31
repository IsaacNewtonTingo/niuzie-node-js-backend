const { Product } = require("../models/products");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const request = require("request");
const { PendingProductPayment } = require("../models/pending-product-payment");
const {
  CompletedProductPayment,
} = require("../models/completed-product-payment");
const { ProductReview } = require("../models/product-reviews");

//check how many products user has posted
exports.checkNumberOfProducts = async (req, res) => {
  try {
    const userID = req.params.id;
    const product = await Product.find({ user: userID });
    const productNumber = product.length;

    res.json({
      status: "Success",
      message: "Number of user products retrieved successfully",
      data: productNumber,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting user product number",
    });
  }
};

exports.postProduct = async (req, res) => {
  try {
    const {
      userID,
      phoneNumber,
      productName,
      category,
      description,
      price,
      image1,
      image2,
      image3,
      image4,
    } = req.body;
    const user = await User.findOne({ _id: userID });
    const premiumUser = user.premium;

    if (premiumUser == true) {
      const newProduct = new Product({
        user: userID,
        productName,
        category,
        description,
        price,
        image1,
        image2,
        image3,
        image4,
        promoted: true,
        paid: true,
        expiryDate: Date.now() + 7776000000,
      });

      await newProduct.save();

      res.json({
        status: "Success",
        message: "Product posted successfully",
      });
    } else {
      //check number of products they have
      const userProducts = await Product.find({ user: userID });
      const numberOfProducts = userProducts.length;

      if (numberOfProducts >= 2) {
        const url = "https://tinypesa.com/api/v1/express/initialize";
        const amount = 1;
        const accountNumber = uuidv4() + userID;
        const body = `amount=${amount}&msisdn=${parseInt(
          phoneNumber
        )}&account_no=${accountNumber}`;
        const headers = {
          Apikey: process.env.APE_30_TINY_PESA_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        };

        //you have to pay to add more products
        request(
          {
            url: url,
            method: "POST",
            headers,
            body,
          },
          async function (error, request, body) {
            if (error) {
              console.log(error);
            } else {
              const jsonBody = JSON.parse(body);
              if (jsonBody.success == true) {
                const newProduct = new Product({
                  user: userID,
                  productName,
                  category,
                  description,
                  price,
                  image1,
                  image2,
                  image3,
                  image4,
                  paid: true,
                  expiryDate: Date.now() + 7776000000,
                });

                paymentStatus(
                  accountNumber,
                  amount,
                  phoneNumber,
                  newProduct,
                  res
                );

                const newPendingPay = new PendingProductPayment({
                  user: userID,
                  amount,
                  accountNumber,
                  phoneNumber,
                });

                await newPendingPay.save();
              }
            }
          }
        );
      } else {
        //you have the chance to post another

        const newProduct = new Product({
          user: userID,
          productName,
          category,
          description,
          price,
          image1,
          image2,
          image3,
          image4,
          expiryDate: Date.now() + 7776000000,
        });

        await newProduct.save();

        res.json({
          status: "Success",
          message: "Product posted successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while posting your product",
    });
  }
};

const paymentStatus = async (
  accountNumber,
  amount,
  phoneNumber,
  newProduct,
  res
) => {
  const interval = setInterval(() => {
    console.log("----Checking payment-----");
    request(
      {
        url: `https://tinypesa.com/api/v1/express/get_status/${accountNumber}`,
        method: "GET",
        headers: {
          Apikey: process.env.APE_30_TINY_PESA_API_KEY,
          Accept: "application/json",
        },
      },
      async function (error, request, body) {
        if (error) {
          console.log(error);
        } else {
          const newBody = JSON.parse(body);
          if (newBody.is_complete == 1) {
            clearInterval(interval);
            clearTimeout(timeOut);

            await PendingProductPayment.findOneAndUpdate(
              { accountNumber },
              { verified: true }
            );

            const newSavedProduct = await newProduct.save();

            const newCompletedPayment = new CompletedProductPayment({
              product: newSavedProduct,
              amount,
              phoneNumber,
              accountNumber,
            });

            await newCompletedPayment.save();

            res.json({
              status: "Success",
              message: "Payment made successfully. Your product was posted",
            });
          }
        }
      }
    );
  }, 1000);

  const timeOut = setTimeout(() => {
    clearInterval(interval);

    res.json({
      status: "Failed",
      message:
        "You did not complete the payment process. Please make sure you are next to your phone and make the payment",
    });
  }, 120000);
};

//review a product
exports.rateProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const { userID, rating, reviewMessage } = req.body;

    //check if product is available
    const product = await Product.findOne({ _id: productID });

    if (product.user == userID) {
      res.json({
        status: "Failed",
        message: "Anauthorized operation. You can't review yourself",
      });
    } else {
      if (product) {
        //rate then add review
        //get all reviews and ratings
        const productReviews = await ProductReview.find({ product: productID });

        if (productReviews.length < 1) {
          //there is no previous review
          await Product.findOneAndUpdate({ _id: productID }, { rating });
          addReview(userID, rating, productID, reviewMessage, res);
        } else {
          const numberOfPeopleRating = productReviews.length + 1;
          const sumOfOldRatings = productReviews
            .map((rating) => rating.rating)
            .reduce((acc, rating) => rating + acc);

          const newRating = (sumOfOldRatings + rating) / numberOfPeopleRating;

          await Product.findOneAndUpdate(
            { _id: productID },
            { rating: newRating }
          ).then(() => {
            addReview(userID, rating, productID, reviewMessage, res);
          });
        }
      } else {
        res.json({
          status: "Failed",
          message: "Can't add review. Product not found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while reviewing product",
    });
  }
};

const addReview = async (userID, rating, productID, reviewMessage, res) => {
  try {
    const newReview = new ProductReview({
      user: userID,
      product: productID,
      rating,
      reviewMessage,
    });

    await newReview.save();
    res.json({
      status: "Success",
      message: "Review added successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while rating product",
    });
  }
};

//delete review
exports.deleteProductReview = async (req, res) => {
  try {
    const { userID, productID } = req.body;
    const reviewID = req.params.id;

    const review = await ProductReview.findOneAndDelete({
      $and: [{ user: userID }, { _id: reviewID }],
    });

    if (review) {
      //update rating
      const productReviews = await ProductReview.find({ product: productID });
      if (productReviews.length < 1) {
        //set rating to 0
        await Product.findOneAndUpdate({ _id: productID }, { rating: 0 });

        res.json({
          status: "Success",
          message: "Review deleted successfully",
        });
      } else {
        const numberOfPeopleRating = productReviews.length;
        const sumOfOldRatings = productReviews
          .map((rating) => rating.rating)
          .reduce((acc, rating) => rating + acc);

        const newRating = sumOfOldRatings / numberOfPeopleRating;

        await Product.findOneAndUpdate(
          { _id: productID },
          { rating: newRating }
        );

        res.json({
          status: "Success",
          message: "Review deleted successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Review not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while deleting review",
    });
  }
};

//get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const productID = req.params.id;
    //check if product is available
    const product = await Product.findOne({ _id: productID });
    if (product) {
      const productReviews = await ProductReview.find({ product: productID });
      res.json({
        status: "Success",
        message: "Product reviews retrieved succesfully",
        data: productReviews,
      });
    } else {
      console.log(error);
      res.json({
        status: "Failed",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting product reviews",
    });
  }
};

//get all products
exports.getAllProducts = async (req, res) => {
  try {
    const {
      productName,
      searchTerm,
      price,
      county,
      subcounty,
      noOfReviews,
      limit,
    } = req.query;

    const products = await Product.find({}).sort().limit();

    res.json({
      status: "Success",
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting products",
    });
  }
};

//get one product
exports.getOneProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findOne({ _id: productID });
    if (product) {
      res.json({
        status: "Success",
        message: "Product retrieved successfully",
        data: product,
      });
    } else {
      res.json({
        status: "Failed",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting product",
    });
  }
};

//update product
exports.updateProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const {
      userID,
      productName,
      category,
      description,
      price,
      image1,
      image2,
      image3,
      image4,
    } = req.body;

    const product = await Product.findOne({ _id: productID });
    if (product.user != userID) {
      res.json({
        status: "Failed",
        message: "Anauthorized operation",
      });
    } else {
      await product.updateOne({
        productName,
        category,
        description,
        price,
        image1,
        image2,
        image3,
        image4,
      });

      res.json({
        status: "Success",
        message: "Product updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating product",
    });
  }
};

//delete product
exports.deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const { userID } = req.body;

    const product = await Product.findOneAndDelete({
      $and: [{ user: userID }, { _id: productID }],
    });
    if (product) {
      res.json({
        status: "Success",
        message: "Product deleted successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while deleting product",
    });
  }
};
