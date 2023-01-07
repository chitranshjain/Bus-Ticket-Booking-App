import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { reactLocalStorage } from "reactjs-localstorage";
import Heading from "../../../SharedComponents/Admin/Heading";
import { makeGetAPICall, makePatchAPICall } from "../../../Utils/api";

import "./Bookings.css";

const Bookings = () => {
  const [bookingType, setBookingType] = useState("upcoming");
  const [upcoming, setUpcomingBookings] = useState([]);
  const [cancelled, setCancelledBookings] = useState([]);
  const [completed, setCompletedBookings] = useState([]);
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "passengerName",
      headerName: "Passenger Name",
      flex: 1,
    },
    {
      field: "passengerPhone",
      headerName: "Passenger Phone",
      flex: 1,
    },
    {
      field: "busName",
      headerName: "Bus Name",
      flex: 1,
    },
    {
      field: "source",
      headerName: "Source City",
      flex: 1,
    },
    {
      field: "destination",
      headerName: "Destination City",
      flex: 1,
    },
    {
      field: "travelDate",
      headerName: "Travel Date",
      flex: 1,
    },
    {
      field: "fare",
      headerName: "Fare",
      flex: 1,
    },
    bookingType === "upcoming" && {
      field: "id",
      headerName: "Mark As Completed",
      flex: 1,
      renderCell: (params) => {
        return (
          <button
            onClick={(event) => {
              event.stopPropagation();
              markCompleted(params.row.id);
            }}
            className="new-bus-btn"
          >
            MARK AS COMPLETED
          </button>
        );
      },
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    const token = reactLocalStorage.get("busAppAuthToken");
    const data1 = await makeGetAPICall(
      `https://bus-ticket-app.onrender.com/api/admin/bookings/upcoming`,
      { Authorization: `Bearer ${token}` }
    );

    console.log(data1.bookings);
    setUpcomingBookings(data1.bookings);
    setRows(
      data1.bookings.map((booking) => {
        return {
          passengerName: booking.userId.name,
          passengerPhone: booking.userId.phoneNumber,
          busName: booking.busId.name,
          source: booking.source,
          destination: booking.destination,
          travelDate: booking.bookingDate,
          fare: booking.amount,
          id: booking._id,
        };
      })
    );

    const data2 = await makeGetAPICall(
      `https://bus-ticket-app.onrender.com/api/admin/bookings/cancelled`,
      { Authorization: `Bearer ${token}` }
    );

    setCancelledBookings(data2.bookings);
    const data3 = await makeGetAPICall(
      `https://bus-ticket-app.onrender.com/api/admin/bookings/completed`,
      { Authorization: `Bearer ${token}` }
    );

    setCompletedBookings(data3.bookings);
  };

  const markCompleted = async (bookingId) => {
    const token = reactLocalStorage.get("busAppAuthToken");
    const data = await makePatchAPICall(
      `https://bus-ticket-app.onrender.com/api/admin/bookings/complete/${bookingId}`,
      { Authorization: `Bearer ${token}` }
    );

    toast.success(data.message);
    getBookings();
  };

  return (
    <div className="admin-bookings-parent">
      <Heading content={"Here's a list of all the bookings received"} />
      <Row>
        <Col xl={2} lg={2} md={2} sm={6} xs={6}>
          <button
            onClick={() => {
              setBookingType("upcoming");
              setRows(
                upcoming.map((booking) => {
                  return {
                    passengerName: booking.userId.name,
                    passengerPhone: booking.userId.phoneNumber,
                    busName: booking.busId.name,
                    source: booking.source,
                    destination: booking.destination,
                    travelDate: booking.bookingDate,
                    fare: booking.amount,
                    id: booking._id,
                  };
                })
              );
            }}
            className="new-bus-btn"
          >
            Upcoming
          </button>
        </Col>
        <Col xl={2} lg={2} md={2} sm={6} xs={6}>
          <button
            onClick={() => {
              setBookingType("cancelled");
              setRows(
                cancelled.map((booking) => {
                  return {
                    passengerName: booking.userId.name,
                    passengerPhone: booking.userId.phoneNumber,
                    busName: booking.busId.name,
                    source: booking.source,
                    destination: booking.destination,
                    travelDate: booking.bookingDate,
                    fare: booking.amount,
                    id: booking._id,
                  };
                })
              );
            }}
            className="new-bus-btn"
          >
            Cancelled
          </button>
        </Col>
        <Col xl={2} lg={2} md={2} sm={6} xs={6}>
          <button
            onClick={() => {
              setBookingType("completed");
              setRows(
                completed.map((booking) => {
                  return {
                    passengerName: booking.userId.name,
                    passengerPhone: booking.userId.phoneNumber,
                    busName: booking.busId.name,
                    source: booking.source,
                    destination: booking.destination,
                    travelDate: booking.bookingDate,
                    fare: booking.amount,
                    id: booking._id,
                  };
                })
              );
            }}
            className="new-bus-btn"
          >
            Completed
          </button>
        </Col>
      </Row>
      <div className="data-grid-parent">
        {rows && (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        )}
      </div>
    </div>
  );
};

export default Bookings;
