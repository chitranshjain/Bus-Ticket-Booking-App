const express = require("express");
const { getAvailableBuses, getBusById } = require("../controllers/bus");
const { checkLogin } = require("../utils/auth-utility");

const router = express.Router();

router.get(
  "/:sourceCity/:destinationCity/:dateOfTravel",
  checkLogin,
  getAvailableBuses
);

router.get("/:busId", checkLogin, getBusById);

module.exports = router;
