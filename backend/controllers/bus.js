const Bus = require("../models/bus");

const getAvailableBuses = async (request, response) => {
  try {
    const { sourceCity, destinationCity, dateOfTravel } = request.params;
    let buses = await Bus.find({
      dateOfTravel: dateOfTravel,
      "cities.cityName": {
        $all: [sourceCity, destinationCity],
      },
    });

    let filteredBuses = [];
    for (let bus of buses) {
      let cities = bus.cities;
      let city1, city2;
      for (let city of cities) {
        if (city.cityName === sourceCity) city1 = city;
        if (city.cityName === destinationCity) city2 = city;
      }

      if (city1.departureTime < city2.departureTime) {
        bus = bus.toObject();
        bus.sourceCity = city1;
        bus.destinationCity = city2;

        filteredBuses.push(bus);
      }
    }

    response.status(200).json({ message: "Buses found", buses: filteredBuses });
  } catch (error) {
    console.log(
      `An error occurred while getting available buses, ERROR : ${error.message}`
    );
    response.status(error.code).json({
      message: "An error occurred while getting available buses",
      error: error.message,
    });
  }
};

const getBusById = async (request, response) => {
  try {
    const { busId } = request.params;
    let bus = await Bus.findById(busId);

    response.status(200).json({ message: "Bus found", bus: bus });
  } catch (error) {
    console.log(
      `An error occurred while getting bus details, ERROR : ${error.message}`
    );
    response.status(error.code).json({
      message: "An error occurred while getting bus details",
      error: error.message,
    });
  }
};

module.exports = { getAvailableBuses, getBusById };
