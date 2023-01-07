import React, { useContext, useEffect, useState } from "react";
import Header from "../../../SharedComponents/User/Header";

import "./Dashboard.css";
import Footer from "../../../SharedComponents/User/Footer";
import { Card, Col, Row } from "react-bootstrap";
import { makeGetAPICall, makePatchAPICall } from "../../../Utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import { toast } from "react-toastify";
import { createPdf } from "../../../Utils/pdf";
import { AuthContext } from "../../../Contexts";

const Dsshboard = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const { userDetails } = useContext(AuthContext);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    const token = reactLocalStorage.get("busAppAuthToken");
    const data1 = await makeGetAPICall(
      "https://bus-ticket-app.onrender.com/api/bookings/upcoming",
      { Authorization: `Bearer ${token}` }
    );
    const data2 = await makeGetAPICall(
      "https://bus-ticket-app.onrender.com/api/bookings/past",
      { Authorization: `Bearer ${token}` }
    );

    setUpcomingBookings(data1.bookings);
    setPastBookings(data2.bookings);
  };

  const cancelBooking = async (bookingId) => {
    const token = reactLocalStorage.get("busAppAuthToken");
    const data = await makePatchAPICall(
      `https://bus-ticket-app.onrender.com/api/bookings/cancel/${bookingId}`,
      { Authorization: `Bearer ${token}` }
    );

    toast.success(data.message);
    getBookings();
  };

  return (
    <>
      <Header active={true} />
      <div className="dashboard-parent-div">
        <div className="user-dashboard">
          <Row>
            <Col lg={6} md={12} sm={12} xs={12}>
              <h4>Upcoming Bookings</h4>
              {upcomingBookings &&
                upcomingBookings.map((booking) => {
                  return (
                    <Card className="user-booking-card">
                      <Row>
                        <Col>
                          <p>{booking.busId.busType}</p>
                          <h5>{booking.busId.name}</h5>
                        </Col>
                        <Col>
                          <p>From</p>
                          <h5>{booking.source}</h5>
                        </Col>
                        <Col>
                          <p>To</p>
                          <h5>{booking.destination}</h5>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p>Travel Date</p>
                          <h5>{booking.bookingDate}</h5>
                        </Col>
                        <Col>
                          <p>Seat Number</p>
                          <h5>{booking.seatNo}</h5>
                        </Col>
                        <Col>
                          <p>Fare</p>
                          <h5>Rs. {booking.amount}</h5>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <button
                            onClick={() => {
                              cancelBooking(booking._id);
                            }}
                          >
                            CANCEL BOOKING
                          </button>
                        </Col>
                        <Col>
                          <button
                            onClick={() => {
                              console.log("calling");
                              createPdf(booking, userDetails);
                            }}
                            className="invoice-btn"
                          >
                            DOWNLOAD INVOICE
                          </button>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
            </Col>
            <Col lg={6} md={12} sm={12} xs={12}>
              <h4>Past Bookings</h4>
              {pastBookings &&
                pastBookings.map((booking) => {
                  return (
                    <Card className="user-booking-card">
                      <Row>
                        <Col>
                          <p>{booking.busId.busType}</p>
                          <h5>{booking.busId.name}</h5>
                        </Col>
                        <Col>
                          <p>From</p>
                          <h5>{booking.source}</h5>
                        </Col>
                        <Col>
                          <p>To</p>
                          <h5>{booking.destination}</h5>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p>Travel Date</p>
                          <h5>{booking.bookingDate}</h5>
                        </Col>
                        <Col>
                          <p>Seat Number</p>
                          <h5>{booking.seatNo}</h5>
                        </Col>
                        <Col>
                          <p>Fare</p>
                          <h5>Rs. {booking.amount}</h5>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {booking.status === "Completed" ? (
                            <button
                              onClick={() => {
                                console.log("calling");
                                createPdf(booking, userDetails);
                              }}
                              className="invoice-btn"
                            >
                              DOWNLOAD INVOICE
                            </button>
                          ) : (
                            <center>
                              <h5 className="cancelled-booking">CANCELLED</h5>
                            </center>
                          )}
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dsshboard;
