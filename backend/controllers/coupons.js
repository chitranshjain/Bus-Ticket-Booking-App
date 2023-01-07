const Coupon = require("../models/coupons");

const getAllValidCoupons = async (request, response) => {
  try {
    const coupons = await Coupon.find({
      validBefore: {
        $gt: Date.now(),
      },
    });

    response
      .status(200)
      .json({ message: "Coupons fetched successfully", coupons: coupons });
  } catch (error) {
    console.log(
      `An error occurred while getting the coupons, ERROR : ${error.message}`
    );
    response.status(error.code).json({
      message: "An error occurred while getting the coupons",
      error: error.message,
    });
  }
};

module.exports = { getAllValidCoupons };
