import React, { useEffect, useState } from "react";
import Header from "../../../SharedComponents/User/Header";
import Footer from "../../../SharedComponents/User/Footer";
import { useParams } from "react-router-dom";

import "./Booking.css";
import { makeGetAPICall, makePostAPICall } from "../../../Utils/api";
import { reactLocalStorage } from "reactjs-localstorage";
import { Col, Row, Card } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const { busDetails, seatNo } = useParams();
  const bus = JSON.parse(busDetails);
  const [coupons, setCoupons] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [options, setOptions] = useState();
  const Navigate = useNavigate();

  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = async () => {
    const token = reactLocalStorage.get("busAppAuthToken");
    const data = await makeGetAPICall(
      `https://bus-ticket-app.onrender.com/api/coupons/`,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    setCoupons(data.coupons);
  };

  const applyCoupon = (coupon) => {
    let discountPercentage = coupon.discountPercentage;
    discountPercentage /= 100;
    setDiscount(discountPercentage * bus.fare);
  };

  const bookSeat = async () => {
    const data = await makePostAPICall(
      "https://bus-ticket-app.onrender.com/api/razorpay/",
      {},
      { amount: bus.fare - discount }
    );

    const options = {
      key: "rzp_test_4ejoQixs8cAUSa",
      name: "Bus Ticket Booking Application",
      description: "Thank You for travelling with us.",
      currency: "INR",
      order_id: data.orderId,
      handler: async (response) => {
        // await completeBooking(response.razorpay_payment_id);
        // console.log(response.razorpay_payment_id);
        const token = reactLocalStorage.get("busAppAuthToken");
        const data = await makePostAPICall(
          "https://bus-ticket-app.onrender.com/api/bookings/",
          { Authorization: `Bearer ${token}` },
          {
            source: bus.sourceCity.cityName,
            destination: bus.destinationCity.cityName,
            seatNo: seatNo,
            bookingDate: bus.dateOfTravel,
            amount: bus.fare - discount,
            busId: bus._id,
          }
        );
        toast.success(data.message);
        Navigate("/");
      },
      theme: {
        color: "#f1bc19",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <React.Fragment>
      <Header active={true} />
      <div className="booking-parent-div">
        <div className="booking-details-div">
          <Row className="booking-details-row">
            <Col lg={6} md={12} className="booking-details-col">
              <h3>Review Journey Details</h3>
              <Row>
                <Col>
                  <div className="bus-details">
                    <h4>{bus.name}</h4>
                    <p>{bus.busType}</p>
                  </div>
                </Col>
                <Col>
                  <div className="bus-details">
                    <h4>{bus.dateOfTravel}</h4>
                    <p>Travel Date</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="bus-details">
                    <h4>From {bus.sourceCity.cityName}</h4>
                    <p>
                      {moment(bus.sourceCity.departureTime).format("hh:mm A")}
                    </p>
                  </div>
                </Col>
                <Col>
                  <div className="bus-details">
                    <h4>To {bus.destinationCity.cityName}</h4>
                    <p>
                      {moment(bus.destinationCity.departureTime).format(
                        "hh:mm A"
                      )}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="bus-details">
                    <h4>{seatNo}</h4>
                    <p>Seat Number</p>
                  </div>
                </Col>
                <Col>
                  <div className="bus-details">
                    <h4>{bus.fare - discount}</h4>
                    <p>Fare</p>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col className="booking-details-col">
              <h3>Confirm Booking</h3>
              <div className="booking-coupons">
                <div className="coupons-list">
                  {coupons &&
                    coupons.map((coupon) => {
                      return (
                        <Card className="booking-coupon">
                          <h4>{coupon.couponName}</h4>
                          <p>
                            Get {coupon.discountPercentage}% off. Offer ends on{" "}
                            {moment(coupon.validBefore).format("DD MMM, YYYY")}
                          </p>
                          <button
                            onClick={() => {
                              applyCoupon(coupon);
                            }}
                          >
                            APPLY COUPON
                          </button>
                        </Card>
                      );
                    })}
                </div>
              </div>
              <div className="fare-details">
                <p>
                  Base Fare: <span>Rs. {bus.fare}</span>
                </p>
                <p>
                  Discount: <span>Rs. {discount}</span>
                </p>
                <p>
                  Final Amount : <span>Rs. {bus.fare - discount}</span>
                </p>
              </div>
              <button onClick={bookSeat} className="confirm-booking-btn">
                CONFIRM BOOKING
              </button>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Booking;
