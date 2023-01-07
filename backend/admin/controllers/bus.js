const Bus = require("../../models/bus");
const HttpError = require("../../utils/error");

const addNewBus = async (request, response) => {
  try {
    console.log(request.body);
    const { name, busType, fare, cities, numberOfSeats, dateOfTravel } =
      request.body;

    const seats = [];
    for (let i = 0; i < numberOfSeats; i++) {
      seats.push({
        seatNo: i + 1,
        isBooked: false,
      });
    }

    if (cities.length < 2)
      throw new HttpError("Atleast two cities should be provided", 422);

    const bus = new Bus({
      name: name,
      busType: busType,
      fare: fare,
      cities: cities.map((city) => {
        return {
          cityName: city.cityName,
          departureTime: new Date(city.departureTime),
        };
      }),
      seats,
      dateOfTravel,
    });

    await bus.save();

    response.status(200).json({ message: "Bus added successfully", bus: bus });
  } catch (error) {
    console.log(
      `An error occurred while adding a new bus, ERROR : ${error.message}`
    );
    response.status(error.code).json({
      message: "An error occurred while adding a new bus",
      error: error.message,
    });
  }
};

const removeBus = async (request, response) => {
  try {
    const busId = request.params.busId;

    const bus = await Bus.findById(busId);

    if (!bus) throw new HttpError("No bus found", 404);

    await bus.remove();

    response.status(200).json({ message: "Bus removed successfully." });
  } catch (error) {
    console.log(
      `An error occurred while adding a new bus, ERROR : ${error.message}`
    );
    response.status(error.code).json({
      message: "An error occurred while adding a new bus",
      error: error.message,
    });
  }
};

const getAllUpcomingBuses = async (request, response) => {
  try {
    const buses = await Bus.find();

    response.status(200).json({ message: "Buses found", buses: buses });
  } catch (error) {
    console.log(
      `An error occurred while adding a new bus, ERROR : ${error.message}`
    );
    response.status(error.code).json({
      message: "An error occurred while adding a new bus",
      error: error.message,
    });
  }
};

module.exports = { addNewBus, removeBus, getAllUpcomingBuses };
