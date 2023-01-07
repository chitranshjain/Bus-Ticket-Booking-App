import React, { useEffect, useState } from "react";
import "./Buses.css";
import Header from "../../../SharedComponents/User/Header";
import { useParams, useNavigate } from "react-router-dom";
import { MdEventSeat } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import Footer from "../../../SharedComponents/User/Footer";
import { Card, Col, Row } from "react-bootstrap";
import { reactLocalStorage } from "reactjs-localstorage";
import { makeGetAPICall, makePostAPICall } from "../../../Utils/api";
import moment from "moment";
import { toast } from "react-toastify";

const Buses = () => {
  const [query, setQuery] = useState(useParams());
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState();
  const [selectedSeat, setSelectedSeat] = useState();
  const [showModal, setShowModal] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    getBuses();
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setQuery((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const getBuses = async () => {
    const token = reactLocalStorage.get("busAppAuthToken");
    const data = await makeGetAPICall(
      `https://bus-ticket-app.onrender.com/api/bus/${query.from}/${
        query.to
      }/${moment(query.date).format("DD MMM, YYYY")}`,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    setBuses(data.buses);
  };

  return (
    <>
      <Header active={true} />
      <div className="buses-parent-div">
        <div className="query-info-div">
          <p>
            <span>{query.from} </span>
            <span>{<BsArrowRight className="query-icon" />}&nbsp;</span>
            <span>{query.to} </span>
            <span>{<AiOutlineCalendar className="query-icon" />} &nbsp;</span>
            <span>{query.date}</span>
          </p>
        </div>
        <Row className="bus-content-row">
          <Col
            className="bus-content-col"
            xl={3}
            lg={3}
            md={12}
            sm={12}
            xs={12}
          >
            <h4>Your Search</h4>
            <input
              placeholder="FROM"
              name="from"
              value={query.from}
              onChange={handleChange}
            />
            <input
              placeholder="TO"
              name="to"
              value={query.to}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="DATE"
              value={query.date}
              name="date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                e.target.type = "text";
              }}
              onChange={handleChange}
            />
            <button
              onClick={() => {
                getBuses();
              }}
            >
              MODIFY SEARCH
            </button>
          </Col>
          <Col
            className="bus-content-col"
            xl={9}
            lg={9}
            md={12}
            sm={12}
            xs={12}
          >
            <h4>Search Results</h4>
            {buses &&
              buses.map((bus) => {
                return (
                  <Card className="bus-info-card">
                    <div className="basic-info-div">
                      <Row className="bus-info-row">
                        <Col className="bus-info-col">
                          <h5>{bus.name}</h5>
                          <p>{bus.busType}</p>
                        </Col>
                        <Col className="bus-info-col">
                          <h5>{bus.sourceCity.cityName}</h5>
                          <p>
                            {moment(bus.sourceCity.departureTime).format(
                              "hh:mm A"
                            )}
                          </p>
                        </Col>
                        <Col className="bus-info-col">
                          <h5>{bus.destinationCity.cityName}</h5>
                          <p>
                            {moment(bus.destinationCity.departureTime).format(
                              "hh:mm A"
                            )}
                          </p>
                        </Col>
                      </Row>
                      <div className="additional-info-div">
                        <p>
                          Fare: <span>Rs. {bus.fare}</span>
                        </p>
                        {!selectedBus || selectedBus._id !== bus._id ? (
                          <button
                            onClick={() => {
                              setSelectedBus(bus);
                            }}
                          >
                            VIEW SEATS
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBus();
                              setSelectedSeat();
                            }}
                          >
                            HIDE SEATS
                          </button>
                        )}
                      </div>
                    </div>
                    {selectedBus && selectedBus._id === bus._id && (
                      <div className="seats-layout-div">
                        <p>
                          Seat Selected : {selectedSeat ? selectedSeat : "None"}
                        </p>
                        <p>
                          Amount : {selectedSeat ? `Rs. ${bus.fare}` : "Rs. 0"}
                        </p>
                        <div className="bus-layout">
                          {bus.seats.map((seat) => {
                            return (
                              <MdEventSeat
                                onClick={() => {
                                  if (selectedSeat === seat.seatNo) {
                                    setSelectedSeat();
                                  } else {
                                    setSelectedSeat(seat.seatNo);
                                  }
                                }}
                                className={`seats-icon ${
                                  seat.isBooked && "disabled"
                                } ${
                                  selectedSeat === seat.seatNo && "selected"
                                } `}
                              />
                            );
                          })}
                        </div>
                        <button
                          onClick={() => {
                            Navigate(
                              `/booking/${JSON.stringify(
                                selectedBus
                              )}/${selectedSeat}`
                            );
                          }}
                        >
                          BOOK NOW
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default Buses;
