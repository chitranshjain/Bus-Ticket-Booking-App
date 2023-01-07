const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const busSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    busType: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    cities: [
      {
        cityName: {
          type: String,
          required: true,
        },
        departureTime: {
          type: Date,
          required: true,
        },
      },
    ],
    seats: [
      {
        seatNo: {
          type: Number,
          required: true,
        },
        isBooked: {
          type: Boolean,
          required: true,
        },
      },
    ],
    dateOfTravel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
