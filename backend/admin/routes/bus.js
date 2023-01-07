const express = require("express");
const { checkAdmin } = require("../../utils/auth-utility");
const {
  addNewBus,
  removeBus,
  getAllUpcomingBuses,
} = require("../controllers/bus");

const router = express.Router();

router.get("/", checkAdmin, getAllUpcomingBuses);

router.post("/", checkAdmin, addNewBus);

router.delete("/:busId", checkAdmin, removeBus);

module.exports = router;
