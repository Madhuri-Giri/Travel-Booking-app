import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Col, Row, Table } from "react-bootstrap";
import "./HotelRoom.css";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Timer from "../timmer/Timer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchHotelRooms } from "../../redux-toolkit/slices/hotelRoomSlice";
import { blockHotelRooms } from "../../redux-toolkit/slices/hotelBlockSlice";
import { useNavigate } from "react-router-dom";
import image_room from "../../assets/images/hotel_dummy_img.png";
import Loading from "../../pages/loading/Loading";

const HotelRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const hotelRooms = location.state?.hotelRooms || [];
  const { persons, NoOfRooms, GuestNationality, hotelName, resultIndex, hotelCode, srdvType, srdvIndex, traceId } = location.state || {};

  useEffect(() => {
    dispatch(fetchHotelRooms());
  }, [dispatch]);

  let isProcessing = false;

  const roomblockHandler = async (event, room) => {
    event.preventDefault();
    setLoading(true);
    if (isProcessing || !room) {
      return;
    }

    setSelectedRoom(room);

    if (!resultIndex || !srdvIndex || !hotelCode || !srdvType || !traceId) {
      console.error("Missing required parameters for fetching hotel room.");
      return;
    }

    isProcessing = true;

    const hotelRoomsDetails = {
      ResultIndex: resultIndex,
      HotelCode: hotelCode,
      TraceId: traceId,
      NoOfRooms: NoOfRooms,
      SrdvIndex: srdvIndex,
      SrdvType: srdvType,
      GuestNationality: GuestNationality,
      HotelName: hotelName,
      HotelRoomsDetails: [
        {
          ChildCount: room.ChildCount || 0,
          RequireAllPaxDetails: room.RequireAllPaxDetails || false,
          RoomId: room.RoomId || 0,
          RoomStatus: room.RoomStatus || 0,
          RoomIndex: room.RoomIndex || 0,
          RoomTypeCode: room.RoomTypeCode || "DEFAULT_CODE",
          RoomTypeName: room.RoomTypeName || "Unknown",
          RatePlanCode: room.RatePlanCode || "",
          RatePlan: room.RatePlan || 0,
          InfoSource: room.InfoSource || "Unknown",
          SequenceNo: room.SequenceNo || "0",
          DayRates: room.DayRates?.map((dayRate) => ({
            Amount: dayRate.Amount || 0,
            Date: dayRate.Date || "Unknown",
          })) || [{ Amount: 0, Date: "Unknown" }],
          Price: {
            CurrencyCode: room.Price?.CurrencyCode || "INR",
            RoomPrice: room.Price?.RoomPrice || 0,
            Tax: room.Price?.Tax || 0,
            ExtraGuestCharge: room.Price?.ExtraGuestCharge || 0,
            ChildCharge: room.Price?.ChildCharge || 0,
            OtherCharges: room.Price?.OtherCharges || 0,
            Discount: room.Price?.Discount || 0,
            PublishedPrice: room.Price?.PublishedPrice || 0,
            PublishedPriceRoundedOff: room.Price?.PublishedPriceRoundedOff || 0,
            OfferedPrice: room.Price?.OfferedPrice || 0,
            OfferedPriceRoundedOff: room.Price?.OfferedPriceRoundedOff || 0,
            AgentCommission: room.Price?.AgentCommission || 0,
            AgentMarkUp: room.Price?.AgentMarkUp || 0,
            ServiceTax: room.Price?.ServiceTax || 0,
            TDS: room.Price?.TDS || 0,
            ServiceCharge: room.Price?.ServiceCharge || 0,
            TotalGSTAmount: room.Price?.TotalGSTAmount || 0,
            GST: {
              CGSTAmount: room.Price?.GST?.CGSTAmount || 0,
              CGSTRate: room.Price?.GST?.CGSTRate || 0,
              CessAmount: room.Price?.GST?.CessAmount || 0,
              CessRate: room.Price?.GST?.CessRate || 0,
              IGSTAmount: room.Price?.GST?.IGSTAmount || 0,
              IGSTRate: room.Price?.GST?.IGSTRate || 0,
              SGSTAmount: room.Price?.GST?.SGSTAmount || 0,
              SGSTRate: room.Price?.GST?.SGSTRate || 0,
              TaxableAmount: room.Price?.GST?.TaxableAmount || 0,
            },
          },
          Amenities: room.Amenities?.length > 0 ? room.Amenities : ["Unknown"],
          SmokingPreference: room.SmokingPreference || "NoPreference",
          CancellationPolicies: room.CancellationPolicies?.map((policy) => ({
            Charge: policy.Charge || 0,
            ChargeType: policy.ChargeType || 0,
            Currency: policy.Currency || "INR",
            FromDate: policy.FromDate || "Unknown",
            ToDate: policy.ToDate || "Unknown",
          })) || [{
            Charge: 0,
            ChargeType: 0,
            Currency: "INR",
            FromDate: "Unknown",
            ToDate: "Unknown",
          }],
          CancellationPolicy: room.CancellationPolicy || "No Policy",
          Inclusion: room.Inclusion?.length > 0 ? room.Inclusion : ["None"],
          LastCancellationDate: room.LastCancellationDate || "Unknown",
          BedTypes: room.BedTypes?.map((bedType) => ({
            BedTypeCode: bedType.BedTypeCode || "DEFAULT_CODE",
            BedTypeDescription: bedType.BedTypeDescription || "Description not available",
          })) || [{
            BedTypeCode: "DEFAULT_CODE",
            BedTypeDescription: "Description not available",
          }],
        },
      ],
      ArrivalTime: new Date().toISOString(),
      IsPackageFare: true,
    };

    try {
      const response = await dispatch(blockHotelRooms(hotelRoomsDetails)).unwrap();
      toast.success("Room reserved successfully!");

      navigate("/hotel-guest", {
        state: {
          blockRoomResult: response.data.BlockRoomResult,
          bookingStatus: response.booking_status,
          persons,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reserve the room. Please try again.");
    } finally {
      setLoading(false);
      isProcessing = false;
    }
  };

  if (loading) {
    return <Loading />;
  }

  const cleanCancellationPolicy = (text) => {
    if (!text) return "";
    let cleanedText = text
      .replace(/#\^#|#!#|\s+/g, " ")
      .replace(/\|/g, "\n")
      .replace(/(\d{2}-\w{3}-\d{4}), (\d{2}:\d{2}:\d{2})/, "$1, $2")
      .replace(/INR (\d+\.\d{2})/, "INR $1")
      .replace(/(\d+)% of total amount/, "$1% of the total amount")
      .replace(/(\d{2}-\w{3}-\d{4})/, "$1");

    cleanedText = cleanedText.replace(/\s{2,}/g, " ").trim();
    return cleanedText;
  };

  return (
    <>
      <CustomNavbar />
          <Timer />

      <div className="room_bg">
        <Container className="room-card-bg">
          <Row>
            <Col className="dummy_img" lg={6}>
              <div className="room_heading">
                <h3>Available Hotel Rooms</h3>
              </div>
              <div className="room_dummy">
                <img src={image_room} alt="room_img" />
              </div>
            </Col>
            <Col className="right-column" lg={6} md={12}>
              {loading && <p>Loading hotel rooms...</p>}
              {!loading && hotelRooms.length === 0 && <p>No hotel room data available.</p>}
              <div className="scrollable-content">
                {hotelRooms.map((room, index) => (
                  <div key={index}>
                    <Card className="hotlecard">
                      <Card.Body className="hotelbody">
                        <div className="room-info">
                          <span>{room.RoomTypeName}</span>
                          <small>₹ {room.Price.RoomPrice.toFixed(0)}</small>
                        </div>

                        <ul className="hotel_a">
                          <li className="amenities">
                            <span>Amenities: </span>
                            {room.Amenities.join(", ") || "None"}
                          </li>
                          <li className="amenities">
                            <span>Smoking Preference: </span>
                            {room.SmokingPreference}
                          </li>
                          <li className="amenities">
                            <span>Bed Types: </span>
                            {room.BedTypes.length > 0
                              ? room.BedTypes.map(bed => bed.BedTypeDescription).join(", ")
                              : "None"}
                          </li>
                        </ul>

                        <p className="amenities_policy">
                          <span>Included:</span> {room.Inclusion.join(", ") || "None"}
                        </p>

                        <div className="table-responsive">
                          <h6>Cancellation Policies</h6>
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Charge</th>
                                <th>Charge Type</th>
                                <th>From Date</th>
                                <th>To Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {room.CancellationPolicies && room.CancellationPolicies.length > 0 ? (
                                room.CancellationPolicies.map((policy, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      {policy.Charge} {policy.Currency}
                                    </td>
                                    <td>{policy.ChargeType}</td>
                                    <td>{new Date(policy.FromDate).toLocaleDateString()}</td>
                                    <td>{new Date(policy.ToDate).toLocaleDateString()}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4">No cancellation policies available.</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>

                        <p className="can_policy">
                          {cleanCancellationPolicy(room.CancellationPolicy)}
                        </p>

                        <button
                          className="reserve_button"
                          onClick={(event) => roomblockHandler(event, room)}
                        >
                          Reserve
                        </button>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default HotelRoom;


// return (
//   <>
//     <CustomNavbar />
//     <Timer />
//     <div className="room_bg">
//       <Container className="room-card-bg">
//         <Row>
//           <Col className="dummy_img" lg={6}>
//             <div className="room_heading">
//               <h3>Available Hotel Rooms</h3>
//             </div>
//             <div className="room_dummy">
//               <img src={image_room} alt="room_img" />
//             </div>
//           </Col>

//           <Col className="right-column" lg={6} md={12}>
//             {loading && <p>Loading hotel rooms...</p>}
//             {hotelRooms.length === 0 && !loading && (
//               <p>No hotel room data available.</p>
//             )}
//             <div className="scrollable-content">
//               {hotelRooms.map((room, index) => (
//                 <div key={index}>
//                   <Card className="hotlecard">
//                     <Card.Body className="hotelbody">
//                       <div className="room-info">
//                         <span >{room.RoomTypeName}</span>
//                         <small>
//                           ₹ {room.Price.RoomPrice.toFixed(0)}</small>
//                       </div>

//                       <ul className="hotel_a">
//                         <li className="amenities">
//                           <span>Amenities:{" "}</span>
//                           {room.Amenities.join(", ") || "None"}
//                         </li>
//                         <li className="amenities">
//                           <span> Smoking Preference{" "}</span>
//                           {room.SmokingPreference}
//                         </li>
//                         <li className="amenities">
//                           <span>  Bed Types:{" "}</span>
//                           {room.BedTypes.length > 0
//                             ? room.BedTypes.map(
//                               (bed) => bed.BedTypeDescription
//                             ).join(", ")
//                             : "None"}
//                         </li>
//                       </ul>

//                       <p className="amenities_policy">
//                         <span> Included:</span>  {room.Inclusion.join(", ") || "None"}
//                       </p>

//                       <div className="table-responsive">
//                         <h6>Cancellation Policies</h6>
//                         <Table striped bordered hover>
//                           <thead>
//                             <tr>
//                               <th>Charge</th>
//                               <th>Charge Type</th>
//                               <th>From Date</th>
//                               <th>To Date</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {room.CancellationPolicies &&
//                               room.CancellationPolicies.length > 0 ? (
//                               room.CancellationPolicies.map((policy, idx) => (
//                                 <tr key={idx}>
//                                   <td>

//                                     {policy.Charge} {policy.Currency}

//                                   </td>
//                                   <td>{policy.ChargeType}</td>
//                                   <td>
//                                     {new Date(
//                                       policy.FromDate
//                                     ).toLocaleDateString()}
//                                   </td>
//                                   <td>
//                                     {new Date(
//                                       policy.ToDate
//                                     ).toLocaleDateString()}
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr>
//                                 <td colSpan="4">
//                                   No cancellation policies available.
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </Table>
//                       </div>

//                       <p className="can_policy">
//                         {cleanCancellationPolicy(room.CancellationPolicy)}
//                       </p>

//                       <button
//                         className="reserve_button"
//                         onClick={(event) => {
//                           roomblockHandler(event, room);
//                         }}
//                       >
//                         Reserve
//                       </button>
//                     </Card.Body>
//                   </Card>
//                 </div>
//               ))}
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//     <Footer />
//   </>
// );
// };

// export default HotelRoom;

