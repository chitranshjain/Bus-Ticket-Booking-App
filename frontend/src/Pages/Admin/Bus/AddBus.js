import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { reactLocalStorage } from "reactjs-localstorage";
import Heading from "../../../SharedComponents/Admin/Heading";
import TextInput from "../../../SharedComponents/Form/TextInput";
import { makePostAPICall } from "../../../Utils/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import "./AddBus.css";

const AddBus = () => {
  const Navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    busType: "",
    numberOfSeats: 0,
    fare: 0,
    dateOfTravel: Date.now(),
    cities: [{ cityName: "", departureTime: "" }],
  });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCityChange = (event, index) => {
    event.preventDefault();
    const cities = data.cities;
    cities[index][event.target.name] = event.target.value;
    setData((prev) => {
      return { ...prev, cities };
    });
  };

  const addCity = () => {
    const cities = data.cities;
    cities.push({ cityName: "", departureTime: "" });
    setData((prev) => {
      return { ...prev, cities };
    });
  };

  const removeCity = (index) => {
    const cities = data.cities;
    cities.splice(index, 1);
    setData((prev) => {
      return { ...prev, cities };
    });
  };

  const addBus = async (event) => {
    event.preventDefault();
    const token = reactLocalStorage.get("busAppAuthToken");
    const response = await makePostAPICall(
      "https://bus-ticket-app.onrender.com/api/admin/bus/",
      {
        Authorization: `Bearer ${token}`,
      },
      {
        ...data,
        dateOfTravel: moment(data.dateOfTravel).format("DD MMM, YYYY"),
      }
    );

    toast.success(response.message);
    Navigate("/admin/bus");
  };

  return (
    <div className="add-bus-parent-div">
      <Heading content="Add a new bus by entering the following information" />

      <TextInput
        label="Bus Name"
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
      />
      <TextInput
        label="Bus Type"
        type="text"
        name="busType"
        value={data.busType}
        onChange={handleChange}
      />
      <TextInput
        label="Number Of Seats"
        type="number"
        name="numberOfSeats"
        value={data.numberOfSeats}
        onChange={handleChange}
      />
      <TextInput
        label="Fare"
        type="number"
        name="fare"
        value={data.fare}
        onChange={handleChange}
      />
      <TextInput
        label="Date Of Travel"
        type="datetime-local"
        name="dateOfTravel"
        value={data.dateOfTravel}
        onChange={handleChange}
      />
      <p>Cities</p>
      {data.cities.map((city, index) => {
        return (
          <Row>
            <Col xl={5}>
              <TextInput
                label="City Name"
                type="text"
                name="cityName"
                value={data.cities[index].cityName}
                onChange={(e) => {
                  handleCityChange(e, index);
                }}
              />
            </Col>
            <Col xl={5}>
              <TextInput
                label="Departure Time"
                type="datetime-local"
                name="departureTime"
                value={data.cities[index].departureTime}
                onChange={(e) => {
                  handleCityChange(e, index);
                }}
              />
            </Col>
            <Col className="add-city-col">
              <div onClick={addCity}>+</div>
            </Col>
            <Col
              onClick={removeCity.bind(null, index)}
              className="remove-city-col"
            >
              <div>-</div>
            </Col>
          </Row>
        );
      })}
      <button
        onClick={addBus}
        style={{ width: "100%" }}
        className="new-bus-btn"
      >
        Add Bus
      </button>
    </div>
  );
};

export default AddBus;
