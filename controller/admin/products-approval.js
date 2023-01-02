const { Product } = require("../../models/seller/products");

exports.approveProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findOne({ _id: productID });

    if (product) {
      if (product.verified == false) {
        await product.updateOne({ verified: true });

        res.json({
          status: "Success",
          message: "Product successfully approved",
        });
      } else {
        await product.updateOne({ verified: false });

        res.json({
          status: "Success",
          message: "Product successfully disapproved",
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
      message: "An error occured while updating product",
    });
  }
};
