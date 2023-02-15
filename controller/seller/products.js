const { Product } = require("../../models/seller/products");
const { v4: uuidv4 } = require("uuid");
const request = require("request");
const {
  PendingProductPayment,
} = require("../../models/admin/pending-product-payment");
const {
  CompletedProductPayment,
} = require("../../models/admin/completed-product-payment");

const User = require("../../models/general/user");
const SaveProduct = require("../../models/general/save-product");

const { ProductReview } = require("../../models/seller/product-reviews");
const { Payments } = require("../../models/general/user-payments");
const { Charges } = require("../../models/admin/charges");

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

//submit products so that they are pending
exports.submitProduct = async (req, res) => {
  try {
    const {
      userID,
      phoneNumber,
      productName,
      category,
      subCategory,
      condition,
      description,
      price,
      image1,
      image2,
      image3,
      image4,
    } = req.body;
    const product = await Product.create({
      user: userID,
      productName,
      category,
      subCategory,
      condition,
      description,
      price,
      image1,
      image2,
      image3,
      image4,
      paid: true,
      pending: true,
      expiryDate: Date.now() + 86400000,
      expiryNotificationDate: Date.now() + 82800000,
    });

    res.json({
      status: "Success",
      message: "Product submitted successfully",
      data: {
        productID: product._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while submitting product",
    });
  }
};

//remove a pending product
exports.removePendingProduct = async (req, res) => {
  try {
    const { userID } = req.query;
    const productID = req.params.id;

    const product = await Product.findOne({
      $and: [{ _id: productID }, { pending: true }],
    });

    if (product) {
      if (product.user == userID) {
        await product.deleteOne();
        res.json({
          status: "Success",
          message: "Product successfully removed",
        });
      } else {
        res.json({
          status: "Failed",
          message: "Anauthorized operation",
        });
      }
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
      message: "An error occured while removing product",
    });
  }
};

//get pending products
exports.getPendingProducts = async (req, res) => {
  try {
    const userID = req.params.id;
    const pendingProducts = await Product.find(
      {
        $and: [{ user: userID }, { pending: true }],
      },
      "-expiryDate -expiryNotificationDate -tenDayExpirationEmailSent -updatedAt -paid -reviewed -verified -active"
    )
      .populate(
        "user",
        "firstName lastName phoneNumber county subCounty premium"
      )
      .populate({ path: "category", select: "categoryName" })
      .populate({ path: "subCategory", select: "subCategoryName" })
      .sort({ createdAt: -1 });

    res.json({
      status: "Success",
      message: "Products retrieved successfully",
      data: pendingProducts,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting pending products",
    });
  }
};

//post many products
exports.publishManyProducts = async (req, res) => {
  try {
    const { userID, phoneNumber, amount, accountNumber } = req.body;
    const charge = await Charges.findOne({ name: "Extra product payment" });
    const perProductAmount = charge.amount; //1 product payment

    const productsToUpdate = await Product.find({
      $and: [{ user: userID }, { pending: true }],
    });
    const numberOfProducts = productsToUpdate.length;
    const requiredAmount = perProductAmount * numberOfProducts;

    if (amount == requiredAmount) {
      //update
      const productsToUpdate = await Product.updateMany(
        {
          $and: [{ user: userID }, { pending: true }],
        },
        { pending: false }
      );
      //add transaction record
      //store record in db
      await Payments.create({
        user: userID,
        phoneNumber,
        extraProduct: null,
        productPromotion: null,
        premium: false,
        accountNumber: accountNumber,
        amountPaid: amount,
      });

      res.json({
        status: "Success",
        message: "Products posted successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "Someting doesn't look right with the amount paid",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while posting products",
    });
  }
};

//finally post product
exports.postProduct = async (req, res) => {
  try {
    const {
      userID,
      phoneNumber,
      productName,
      category,
      subCategory,
      condition,
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
        subCategory,
        condition,
        description,
        price,
        image1,
        image2,
        image3,
        image4,
        promoted: true,
        paid: true,
        pending: false,
        verified: true,
        active: true,
        reviewed: false,
        expiryDate: Date.now() + 7776000000,
      });

      const savedProduct = await newProduct.save();

      res.json({
        status: "Success",
        message: "Product posted successfully",
        data: savedProduct._id,
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
                  subCategory,
                  condition,
                  description,
                  price,
                  image1,
                  image2,
                  image3,
                  image4,
                  paid: true,
                  pending: false,
                  expiryDate: Date.now() + 7776000000,
                });

                paymentStatus(
                  userID,
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
          subCategory,
          condition,
          description,
          price,
          image1,
          image2,
          image3,
          image4,
          pending: false,
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

//checking payment
const paymentStatus = async (
  userID,
  accountNumber,
  amount,
  phoneNumber,
  newProduct,
  res
) => {
  let complete = 0;
  let responseSent = false;

  const interval = setInterval(() => {
    console.log("----Checking payment-----");

    if (complete !== 1 && !responseSent) {
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
            complete = newBody.is_complete;
            if (complete == 1 && !responseSent) {
              clearInterval(interval);
              clearTimeout(timeOut);
              responseSent = true;

              await PendingProductPayment.findOneAndUpdate(
                { accountNumber },
                { verified: true }
              );

              const newSavedProduct = await newProduct.save();

              const newCompletedPayment = new CompletedProductPayment({
                user: userID,
                product: newSavedProduct,
                amount,
                phoneNumber,
                accountNumber,
              });

              const savedProduct = await newCompletedPayment.save();

              const newPayment = new Payments({
                user: userID,
                phoneNumber,
                extraProduct: newSavedProduct,
                productPromotion: null,
                premium: false,
                amountPaid: amount,
                accountNumber,
              });

              await newPayment.save();

              res.json({
                status: "Success",
                message: "Payment made successfully. Your product was posted",
                data: savedProduct._id,
              });
            }
          }
        }
      );
    }
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
  console.log("deleteing");
  try {
    const { userID, productID } = req.query;
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
      const productReviews = await ProductReview.find({
        product: productID,
      })
        .populate({
          path: "user",
          select: "firstName lastName profilePicture",
        })
        .limit(5);
      res.json({
        status: "Success",
        message: "Product reviews retrieved succesfully",
        data: productReviews,
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
      message: "An error occured while getting product reviews",
    });
  }
};

//get all products
exports.getAllProducts = async (req, res) => {
  try {
    var {
      searchTerm,
      category,
      subCategory,
      county,
      subCounty,
      condition,

      price,
      rating,
      createdAt,
      promoted,

      limit,
      pageNumber,
    } = req.query;

    limit = 20;
    pageNumber = 0;

    sort = {
      price,
      rating,
      createdAt,
      promoted,
    };

    if (category && !subCategory) {
      const products = await Product.find({
        $and: [
          {
            $or: [
              { description: { $regex: searchTerm, $options: "i" } },
              { productName: { $regex: searchTerm, $options: "i" } },
            ],
          },
          { pending: false },
          { reviewed: true },
          { verified: true },
          { active: true },
          {
            condition: condition ? condition : { $regex: "e", $options: "i" },
          },
          { category: category },
        ],
      })
        .populate(
          "user",
          "firstName lastName phoneNumber county subCounty premium"
        )
        .populate("category", "categoryName")
        .populate("subCategory", "subCategoryName")
        .sort(sort)

        .limit(parseInt(limit))
        .skip(parseInt(pageNumber) * parseInt(limit));

      if (county && !subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (product.user.county == county) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else if (!county && subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (product.user.subCounty == subCounty) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else if (county && subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (
            product.user.county == county &&
            product.user.subCounty == subCounty
          ) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else {
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: products,
        });
      }
    } else if (category && subCategory) {
      const products = await Product.find({
        $and: [
          {
            $or: [
              { description: { $regex: searchTerm, $options: "i" } },
              { productName: { $regex: searchTerm, $options: "i" } },
            ],
          },
          { pending: false },
          { reviewed: true },
          { verified: true },
          { active: true },

          {
            condition: condition ? condition : { $regex: "e", $options: "i" },
          },
          { category: category },
          { subCategory: subCategory },
        ],
      })
        .populate(
          "user",
          "firstName lastName phoneNumber county subCounty premium"
        )
        .populate("category", "categoryName")
        .populate("subCategory", "subCategoryName")
        .sort(sort)

        .limit(parseInt(limit))
        .skip(parseInt(pageNumber) * parseInt(limit));

      if (county && !subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (product.user.county == county) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else if (!county && subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (product.user.subCounty == subCounty) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else if (county && subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (
            product.user.county == county &&
            product.user.subCounty == subCounty
          ) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else {
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: products,
        });
      }
    } else if (!category && !subCategory) {
      const products = await Product.find({
        $and: [
          {
            $or: [
              { description: { $regex: searchTerm, $options: "i" } },
              { productName: { $regex: searchTerm, $options: "i" } },
            ],
          },
          { pending: false },
          { reviewed: true },
          { verified: true },
          { active: true },

          {
            condition: condition ? condition : { $regex: "e", $options: "i" },
          },
        ],
      })
        .populate(
          "user",
          "firstName lastName phoneNumber county subCounty premium"
        )
        .populate("category", "categoryName")
        .populate("subCategory", "subCategoryName")
        .sort(sort)

        .limit(parseInt(limit))
        .skip(parseInt(pageNumber) * parseInt(limit));

      if (county && !subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (product.user.county == county) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else if (!county && subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (product.user.subCounty == subCounty) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else if (county && subCounty) {
        const filteredProducts = products.filter(function (product) {
          if (
            product.user.county == county &&
            product.user.subCounty == subCounty
          ) {
            return true;
          }
        });
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: filteredProducts,
        });
      } else {
        res.json({
          status: "Success",
          message: "Products retrieved successfully",
          data: products,
        });
      }
    }
  } catch (err) {
    console.log(err);
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
    const product = await Product.findOne({ _id: productID })
      .populate({
        path: "user",
        select:
          "firstName lastName phoneNumber profilePicture county subCounty",
      })
      .populate({ path: "category" })
      .populate({ path: "subCategory" });
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
        active: false,
        verified: false,
        reviewed: false,
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
    const { userID } = req.query;

    const product = await Product.findOneAndDelete({
      $and: [{ user: userID }, { _id: productID }],
    });

    //find if saved and delete

    await SaveProduct.deleteMany({ product: productID });
    await ProductReview.deleteMany({ product: productID });
    //find all reviews and delete
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

exports.getActiveUserProducts = async (req, res) => {
  const userID = req.params.id;
  const { productID } = req.query;

  try {
    //if there is product id, remove that product from response
    const products = await Product.find({
      $and: [{ user: userID }, { active: true }],
    })
      .populate("user", "-password -seller -admin")
      .populate("category", "categoryName")
      .populate("subCategory", "subCategoryName")
      .limit(20);

    if (productID) {
      const filteredProducts = products.filter(function (product) {
        if (product._id != productID) {
          return true;
        }
      });

      res.json({
        status: "Success",
        message: "Products fetched successfully",
        data: filteredProducts,
      });
    } else {
      res.json({
        status: "Success",
        message: "Products fetched successfully",
        data: products,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting user products",
    });
  }
};

exports.getAllUserProducts = async (req, res) => {
  const userID = req.params.id;

  try {
    //if there is product id, remove that product from response
    const products = await Product.find({
      user: userID,
    })
      .populate("user", "-password -seller -admin")
      .populate("category", "categoryName")
      .populate("subCategory", "subCategoryName")
      .limit(20);

    const activeProducts = products.filter(
      (product) =>
        product.active &&
        product.reviewed &&
        !product.pending &&
        product.verified
    );

    const underReviewProducts = products.filter(
      (product) =>
        !product.active &&
        !product.reviewed &&
        !product.pending &&
        !product.verified
    );
    const inactiveProducts = products.filter(
      (product) =>
        !product.active &&
        product.reviewed &&
        !product.pending &&
        !product.verified
    );

    res.json({
      status: "Success",
      message: "Products fetched successfully",
      data: {
        activeProducts: activeProducts,
        underReviewProducts: underReviewProducts,
        inactiveProducts: inactiveProducts,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting user products",
    });
  }
};

exports.getOtherUserProducts = async (req, res) => {
  const userID = req.params.id;
  const { productID } = req.query;

  try {
    //if there is product id, remove that product from response
    const products = await Product.find({
      $and: [
        { user: userID },
        { pending: false },
        { reviewed: true },
        { verified: true },
        { active: true },
      ],
    })
      .populate("user", "-password -seller -admin")
      .populate("category", "categoryName")
      .populate("subCategory", "subCategoryName")
      .limit(20);

    if (productID) {
      const filteredProducts = products.filter(function (product) {
        if (product._id != productID) {
          return true;
        }
      });

      res.json({
        status: "Success",
        message: "Products fetched successfully",
        data: filteredProducts,
      });
    } else {
      res.json({
        status: "Success",
        message: "Products fetched successfully",
        data: products,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting user products",
    });
  }
};

//premium users products
exports.getPremiumUserProducts = async (req, res) => {
  try {
    let { pageNumber, limit } = req.query;

    limit = 20;
    pageNumber = 0;

    const products = await Product.find({
      $and: [
        { active: true },
        { pending: false },
        { reviewed: true },
        { verified: true },
      ],
    })
      .populate("user", "-password -seller -admin")
      .populate("category", "categoryName")
      .populate("subCategory", "subCategoryName")
      .limit(parseInt(limit))
      .skip(parseInt(pageNumber) * parseInt(limit));

    const premiumUserProducts = products.filter(function (product) {
      if (product.user.premium == true) {
        return true;
      }
    });
    res.json({
      status: "Success",
      message: "Products retrieved successfully",
      data: premiumUserProducts,
    });
  } catch (error) {
    console.log(err);
    res.json({
      status: "Failed",
      message: "An error occured while getting products",
    });
  }
};

//save products
exports.saveProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const { userID } = req.body;

    //check if product exists
    const product = await Product.findOne({ _id: productID });
    if (product) {
      //check if saved
      const check = await SaveProduct.findOne({
        $and: [{ user: userID }, { product: productID }],
      });

      if (!check) {
        //not saved
        const newSavedProduct = new SaveProduct({
          user: userID,
          product: productID,
        });

        await newSavedProduct.save();

        res.json({
          status: "Success",
          message: "Product saved successfully",
        });
      } else {
        //saved so unsave
        await SaveProduct.deleteOne({
          $and: [{ user: userID }, { product: productID }],
        });

        res.json({
          status: "Success",
          message: "Product unsaved successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(err);
    res.json({
      status: "Failed",
      message: "An error occured while saving product",
    });
  }
};

exports.getSavedProducts = async (req, res) => {
  try {
    const userID = req.params.id;

    const products = await SaveProduct.find({
      user: userID,
    }).populate({
      path: "product",
      select:
        "user productName category subCategory condition description price rating image1 image2 image3 image4 promoted expiryNotificationDate active",
      populate: [
        {
          path: "user",
          select:
            "firstName lastName profilePicture phoneNumber admin premium county subCounty",
        },
        { path: "category", select: "categoryName" },
        { path: "subCategory", select: "subCategoryName" },
      ],
    });

    const activeSavedProducts = products.filter(
      (product) => product.product.active
    );

    res.json({
      status: "Success",
      message: "Saved products retrieved successfully",
      data: activeSavedProducts,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting saved products",
    });
  }
};

exports.getOneSavedProduct = async (req, res) => {
  try {
    const userID = req.params.id;
    const { productID } = req.query;

    const product = await SaveProduct.findOne({
      $and: [{ user: userID }, { product: productID }],
    }).populate({
      path: "product",
      populate: { path: "user" },
    });
    res.json({
      status: "Success",
      message: "Saved products retrieved successfully",
      data: product ? true : false,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting saved product",
    });
  }
};

exports.upload = async (req, res) => {
  const image = req;
  try {
    // const result = await cloudinary.uploader.upload(image);

    res.send(image);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

exports.getSellerProfile = async (req, res) => {
  try {
    const userID = req.params.id;

    const user = await User.findOne(
      { _id: userID },
      "firstName lastName phoneNumber profilePicture county subCounty"
    );
    res.json({
      status: "Success",
      message: "Seller data retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting seller data",
    });
  }
};
