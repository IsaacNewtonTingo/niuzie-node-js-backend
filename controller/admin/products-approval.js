const { Product } = require("../../models/seller/products");

exports.approveProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findOne({ _id: productID });

    if (product) {
      if (product.verified == false) {
        await product.updateOne({ verified: true, active: true });

        res.json({
          status: "Success",
          message: "Product successfully approved",
        });

        //send email to the seller indicating their product is live
      } else {
        await product.updateOne({ verified: false });

        res.json({
          status: "Success",
          message: "Product successfully disapproved",
        });
      }

      //send rejection email to seller
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
      message: "An error occured while updating product",
    });
  }
};

//get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      status: "Success",
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: "An error occured while getting products",
      data: error,
    });
  }
};
//get all users
