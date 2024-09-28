import React, { useEffect, useState, useRef } from "react";
import "./GuestDetails.css";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Accordion from "react-bootstrap/Accordion";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import { RiTimerLine } from "react-icons/ri";
import he from "he";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import parse from "html-react-parser";
import Loading from "../../pages/loading/Loading";
import PayloaderHotel from "../../pages/loading/PayloaderHotel";
import Timer from "../timmer/Timer";
import Popup from "../guestDetails/PopUp";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelRooms } from "../../redux-toolkit/slices/hotelRoomSlice";
import { blockHotelRooms } from "../../redux-toolkit/slices/hotelBlockSlice";
import { bookHotel } from "../../redux-toolkit/slices/hotelBookSlice";
import { searchHotels } from "../../redux-toolkit/slices/hotelSlice";

const GuestDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { persons } = location.state || {};
  const [hotelBlock, setHotelBlock] = useState([]);
  const [selectedRoomsData, setSelectedRoomsData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
  const [isNormsExpanded, setIsNormsExpanded] = useState(false);

  const [guestForms, setGuestForms] = useState(
    Array.from({ length: persons[0].NoOfAdults }).map(() => ({
      fname: "",
      mname: "",
      lname: "",
      email: "",
      mobile: "",
      age: "",
      passportNo: "",
      pan: "",
      paxType: "",
      leadPassenger: "",
    }))
  );

  // Track the current guest form being filled
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0); // Start with the first guest
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [guestsRemaining, setGuestsRemaining] = useState(persons[0].NoOfAdults); // Initially all guests need forms
  const [payLoading, setPayLoading] = useState(false);

  const { blockRoomResult, bookingStatus } = location.state || {};
  const bookingDetails = bookingStatus?.[0] || {};
  const [errors, setErrors] = useState({});

  const handleDateChange = (index, date, field) => {
    const newGuestForms = [...guestForms];
    newGuestForms[index] = {
      ...newGuestForms[index],
      [field]: date,
    };
    setGuestForms(newGuestForms);
  };

  useEffect(() => {
    console.log("persons in guest details", persons[0].NoOfAdults);
  }, []);

  // Check if the current form is complete
  const checkCurrentFormCompletion = (formData) => {
    return !(
      formData.fname &&
      formData.lname &&
      formData.email &&
      formData.mobile &&
      formData.age &&
      formData.leadPassenger &&
      formData.paxType
    );
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (checkCurrentFormCompletion(guestForms[currentGuestIndex])) {
      alert("Please complete all required fields for the current guest.");
      return;
    }

    // After the current form is completed, go to the next form
    const newGuestIndex = currentGuestIndex + 1;

    if (newGuestIndex < guestForms.length) {
      setCurrentGuestIndex(newGuestIndex);
    } else {
      // All forms are completed
      setFormSubmitted(true);
      setShowPopup(true);
    }

    // Update remaining guests count
    setGuestsRemaining(guestsRemaining - 1);
  };

  // Handle form changes and update the current guest's form data
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updatedForms = [...guestForms];
    updatedForms[currentGuestIndex] = {
      ...updatedForms[currentGuestIndex],
      [name]: value,
    };
    setGuestForms(updatedForms);
  };

  // Close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Handle checkbox change for confirmation
  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
  };
  // ---------------- RozarPay Payment Gateway  Integration start -------------------
  const fetchPaymentDetails = async () => {
    try {
      const loginId = localStorage.getItem("loginId");
      const transactionNum = localStorage.getItem("transactionNum");
      // Get the ID from bookingStatus if it exists
      const bookingId =
        bookingStatus && bookingStatus.length > 0 ? bookingStatus[0].id : null;

      console.log("loginId:", loginId);
      console.log("transactionNum:", transactionNum);
      console.log("hotel_booking_id:", bookingId);

      if (!loginId || !transactionNum || !bookingId) {
        // Check bookingId instead of hotel_booking_id
        throw new Error(
          "Login ID, Transaction Number, or Hotel Booking ID is missing."
        );
      }

      const payload = {
        amount: totalPrice,
        user_id: loginId,
        transaction_num: transactionNum,
        hotel_booking_id: [bookingId],
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        "https://sajyatra.sajpe.in/admin/api/create-payment",
        payload
      );

      if (response.data.status === "success") {
        setPaymentDetails(response.data.payment_details);
        console.log("Payment details fetched:", response.data);
        return response.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch payment details"
        );
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      alert("Failed to initiate payment. Please try again.");
      return null;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const loginId = localStorage.getItem("loginId");
    if (!loginId) {
      navigate("/enter-number");
      return;
    }

    try {
      const paymentData = await fetchPaymentDetails();
      if (!paymentData) return;

      // Assuming the first guest is the lead guest
      const leadGuest = guestForms[0];

      const options = {
        key: paymentData.razorpay_key,
        amount: paymentData.payment_details.amount * 100,
        currency: "INR",
        transaction_id: paymentData.payment_details.id,
        name: "SRN Infotech",
        description: "Test Transaction",
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          console.log("Payment successful", response);

          localStorage.setItem("payment_id", response.razorpay_payment_id);
          localStorage.setItem("transaction_id", options.transaction_id);

          setPayLoading(true);

          try {
            await updateHandlePayment();

            setPayLoading(false);

            await bookHandler();
          } catch (error) {
            console.error(
              "Error during updateHandlePayment or bookHandler:",
              error.message
            );
            alert("An error occurred during processing. Please try again.");
          }
        },
        prefill: {
          name: `${leadGuest.fname} ${leadGuest.mname} ${leadGuest.lname}`,
          email: leadGuest.email,
          contact: leadGuest.mobile,
        },
        notes: {
          address: "Some Address",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp1.open();
    } catch (error) {
      console.error("Error during payment setup:", error.message);
      alert("An error occurred during payment setup. Please try again.");
    }
  };
  // --------------Update payment------------
  const updateHandlePayment = async () => {
    try {
      const payment_id = localStorage.getItem("payment_id");
      const transaction_id = localStorage.getItem("transaction_id");

      if (!payment_id || !transaction_id) {
        throw new Error("Missing payment details");
      }

      const url = "https://sajyatra.sajpe.in/admin/api/update-payment";
      const payload = {
        payment_id,
        transaction_id,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to update payment details. Status:",
          response.status,
          "Response:",
          errorText
        );
        throw new Error("Failed to update payment details");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      const status = data.data.status;
      console.log("statusHotel", status);
    } catch (error) {
      console.error("Error updating payment details:", error.message);
      throw error;
    }
  };
  // ----------------Payment Integration End -------------------

  const [selectedRoom, setSelectedRoom] = useState([]);
  const hotelRooms = location.state?.hotelRooms || [];

  const {
    hotels = [],
    srdvType,
    resultIndexes,
    srdvIndexes,
    hotelCodes,
    traceId,
  } = useSelector((state) => state.hotelSearch || {});

  //  ----------------------------Start book api-----------------------------------
  // Construct the booking payload

  let isProcessing = false;

  const bookHandler = async (index) => {
    // console.log("booking handler", bookHandler);
    console.log("processing", isProcessing);

    console.log("selected", selectedRoom);
    if (isProcessing || selectedRoom.length > 0) {
      console.log("selected");
      return;
    }

    isProcessing = true;

    const validateGuestForms = (guestForms) => {
      const errors = [];
      guestForms.forEach((formData, idx) => {
        if (
          !formData.fname ||
          formData.fname.length < 2 ||
          formData.fname.length > 30
        ) {
          errors.push(
            `First Name is required and must be between 2 and 30 characters at index ${idx}`
          );
        }
        if (
          !formData.lname ||
          formData.lname.length < 2 ||
          formData.lname.length > 30
        ) {
          errors.push(
            `Last Name is required and must be between 2 and 30 characters at index ${idx}`
          );
        }
        if (
          !formData.email ||
          !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)
        ) {
          errors.push(`A valid Email is required at index ${idx}`);
        }
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
          errors.push(`Contact Number must be 10 digits at index ${idx}`);
        }
        if (
          formData.age === "" ||
          isNaN(formData.age) ||
          formData.age < 18 ||
          formData.age > 100
        ) {
          errors.push(`Age must be between 18 and 100 at index ${idx}`);
        }
        if (!["Yes", "No"].includes(formData.leadPassenger)) {
          errors.push(`Lead Passenger must be 'Yes' or 'No' at index ${idx}`);
        }
        if (![1, 2].includes(Number(formData.paxType))) {
          errors.push(
            `Pax Type must be '1' (for Adult) or '2' (for Child) at index ${idx}`
          );
        }
      });
      return errors;
    };

    const formatDate = (date) => {
      const d = new Date(date);
      return isNaN(d.getTime())
        ? new Date().toISOString().slice(0, 19)
        : d.toISOString().slice(0, 19);
    };

    const errors = validateGuestForms(guestForms);
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      isProcessing = false;
      return;
    }

    try {
      const bookingId =
        bookingStatus && bookingStatus.length > 0 ? bookingStatus[0].id : null;
      const transactionNum = localStorage.getItem("transactionNum");
      const transaction_id = localStorage.getItem("transaction_id");

      if (!transactionNum || !transaction_id || !bookingId) {
        throw new Error("Required data missing for booking.");
      }

      const bookingPayload = {
        ResultIndex: "9",
        HotelCode: "92G|DEL",
        HotelName: "The Manor",
        GuestNationality: "IN",
        NoOfRooms: "1",
        ClientReferenceNo: 0,
        IsVoucherBooking: true,
        transaction_num: transactionNum,
        transaction_id: transaction_id,
        hotel_booking_id: [bookingId],

        HotelRoomsDetails: [
          {
            ChildCount: selectedRoom.ChildCount || 0,
            RequireAllPaxDetails: selectedRoom.RequireAllPaxDetails || false,
            RoomId: selectedRoom.RoomId || 0,
            RoomStatus: selectedRoom.RoomStatus || 0,
            RoomIndex: selectedRoom.RoomIndex || 0,
            RoomTypeCode: selectedRoom.RoomTypeCode || "DEFAULT_CODE",
            RoomTypeName: selectedRoom.RoomTypeName || "Unknown",
            RatePlanCode: selectedRoom.RatePlanCode || "",
            RatePlan: selectedRoom.RatePlan || 0,
            InfoSource: selectedRoom.InfoSource || "Unknown",
            SequenceNo: selectedRoom.SequenceNo || "0",
            DayRates: selectedRoom.DayRates?.map((dayRate) => ({
              Amount: dayRate.Amount || 0,
              Date: dayRate.Date || "Unknown",
            })) || [{ Amount: 0, Date: "Unknown" }],
            HotelPassenger: guestForms.map((guest) => ({
              Title: guest.title || "Mr",
              FirstName: guest.fname || "",
              MiddleName: guest.mname || "",
              LastName: guest.lname || "",
              Phoneno: guest.mobile || "",
              Email: guest.email || "",
              Age: guest.age || "",
              PaxType: guest.paxType || "",
              LeadPassenger: guest.leadPassenger || "",
              PassportNo: guest.passportNo || "",
              PAN: guest.pan || "",
            })),
            SupplierPrice: selectedRoom.SupplierPrice || null,
            Price: {
              CurrencyCode: selectedRoom.Price?.CurrencyCode || "INR",
              RoomPrice: selectedRoom.Price?.RoomPrice || 0,
              Tax: selectedRoom.Price?.Tax || 0,
              ExtraGuestCharge: selectedRoom.Price?.ExtraGuestCharge || 0,
              ChildCharge: selectedRoom.Price?.ChildCharge || 0,
              OtherCharges: selectedRoom.Price?.OtherCharges || 0,
              Discount: selectedRoom.Price?.Discount || 0,
              PublishedPrice: selectedRoom.Price?.PublishedPrice || 0,
              PublishedPriceRoundedOff:
                selectedRoom.Price?.PublishedPriceRoundedOff || 0,
              OfferedPrice: selectedRoom.Price?.OfferedPrice || 0,
              OfferedPriceRoundedOff:
                selectedRoom.Price?.OfferedPriceRoundedOff || 0,
              AgentCommission: selectedRoom.Price?.AgentCommission || 0,
              AgentMarkUp: selectedRoom.Price?.AgentMarkUp || 0,
              ServiceTax: selectedRoom.Price?.ServiceTax || 0,
              TDS: selectedRoom.Price?.TDS || 0,
              ServiceCharge: selectedRoom.Price?.ServiceCharge || 0,
              TotalGSTAmount: selectedRoom.Price?.TotalGSTAmount || 0,
              GST: {
                CGSTAmount: selectedRoom.Price?.GST?.CGSTAmount || 0,
                CGSTRate: selectedRoom.Price?.GST?.CGSTRate || 0,
                CessAmount: selectedRoom.Price?.GST?.CessAmount || 0,
                CessRate: selectedRoom.Price?.GST?.CessRate || 0,
                IGSTAmount: selectedRoom.Price?.GST?.IGSTAmount || 0,
                IGSTRate: selectedRoom.Price?.GST?.IGSTRate || 0,
                SGSTAmount: selectedRoom.Price?.GST?.SGSTAmount || 0,
                SGSTRate: selectedRoom.Price?.GST?.SGSTRate || 0,
                TaxableAmount: selectedRoom.Price?.GST?.TaxableAmount || 0,
              },
            },
            RoomPromotion: selectedRoom.RoomPromotion || "",
            Amenities: selectedRoom.Amenities || ["Unknown"],
            SmokingPreference: selectedRoom.SmokingPreference || "NoPreference",
            BedTypes: selectedRoom.BedTypes?.map((bedType) => ({
              BedTypeCode: bedType.BedTypeCode || "0",
              BedTypeDescription: bedType.BedTypeDescription || "Unknown",
            })) || [{ BedTypeCode: "0", BedTypeDescription: "Unknown" }],
            HotelSupplements: selectedRoom.HotelSupplements || [
              { Supplement: "None" },
            ],
            LastCancellationDate:
              selectedRoom.LastCancellationDate || "Unknown",
            CancellationPolicies: selectedRoom.CancellationPolicies?.map(
              (policy) => ({
                Charge: policy.Charge || 0,
                ChargeType: policy.ChargeType || 0,
                Currency: policy.Currency || "INR",
                FromDate: formatDate(policy.FromDate || new Date()),
                ToDate: formatDate(policy.ToDate || new Date()),
              })
            ) || [
                {
                  Charge: 0,
                  ChargeType: 0,
                  Currency: "INR",
                  FromDate: formatDate(new Date()),
                  ToDate: formatDate(new Date()),
                },
              ],
            CancellationPolicy: selectedRoom.CancellationPolicy || "No Policy",
            Inclusion: selectedRoom.Inclusion || ["None"],
            BedTypeCode: selectedRoom.BedTypeCode || "NA",
            Supplements: selectedRoom.Supplements || ["None"],
          },
        ],
        ArrivalTime: "2019-09-28T00:00:00",
        IsPackageFare: true,
        SrdvType: "SingleTB",
        SrdvIndex: "SrdvTB",
        TraceId: "1",
      };

      console.log("Booking Payload: ", bookingPayload);

      const responseBody = await dispatch(bookHotel(bookingPayload)).unwrap();
      toast.success("Hotel Booking successful!");

      localStorage.setItem("HotelBookingDetails", JSON.stringify(responseBody));
      setTimeout(() => {
        navigate("/hotel-ticket", {
          state: { bookingDetails: responseBody.hotelBooking },
        });
      }, 2000);
    } catch (error) {
      console.error("Error during hotel booking:", error.message);
      toast.error("An error occurred during hotel booking. Please try again.");
    } finally {
      isProcessing = false;
    }
  };

  // -------------------------------End Book API--------------------------------------------
  // Function to calculate the total price after GST and discount
  const calculateTotalPrice = (details) => {
    const roomPrice = details.roomprice || 0;
    const gstRate = details.igst || 0;
    const discountRate = details.discount || 0;

    const gstAmount = (roomPrice * gstRate) / 100;
    const discountAmount = (roomPrice * discountRate) / 100;

    const totalPrice = roomPrice + gstAmount - discountAmount;

    return totalPrice.toFixed(2); // Format to two decimal places
  };

  const totalPrice = calculateTotalPrice(bookingDetails);

  const cleanUpDescription = (description) => {
    if (!description) return "";
    let cleanedDescription = he.decode(description);
    cleanedDescription = cleanedDescription.replace(
      /<\/?(ul|li|b|i|strong|em|span)\b[^>]*>/gi,
      ""
    );
    cleanedDescription = cleanedDescription.replace(
      /<br\s*\/?>|<p\s*\/?>|<\/p>/gi,
      "\n"
    );
    cleanedDescription = cleanedDescription.replace(/\\|\|/g, "");
    cleanedDescription = cleanedDescription.replace(/\s{2,}/g, " ");
    cleanedDescription = cleanedDescription.replace(/\n{2,}/g, "\n");
    cleanedDescription = cleanedDescription.replace(/\/\/+|\\|\|/g, "");
    cleanedDescription = cleanedDescription.trim();
    cleanedDescription = cleanedDescription.replace(/"/g, "");
    cleanedDescription = cleanedDescription.replace(/<\/li>/gi, "\n");
    cleanedDescription = cleanedDescription.replace(/<\/?ul>/gi, "\n");
    cleanedDescription = cleanedDescription.replace(
      /<br\s*\/?>|<\/p>|<p\s*\/?>/gi,
      "\n"
    );
    cleanedDescription = cleanedDescription.replace(
      /<\/?(b|i|strong|em|span)\b[^>]*>/gi,
      ""
    );
    cleanedDescription = cleanedDescription.replace(/\\|\|/g, "");
    cleanedDescription = cleanedDescription.replace(/\s{2,}/g, " ");
    cleanedDescription = cleanedDescription.replace(/\n{2,}/g, "\n");
    cleanedDescription = cleanedDescription.trim();
    cleanedDescription = cleanedDescription.replace(
      /(?:Valid From|Check-in hour|Identification card at arrival)/gi,
      "\n$&"
    );
    cleanedDescription = cleanedDescription.replace(
      /<li>/gi,
      (match, offset, string) => {
        const listItems = string.split("</li>");
        const index = listItems.indexOf(match);
        return `${index + 1}. `;
      }
    );
    return cleanedDescription;
  };

  const togglePolicyExpand = () => {
    setIsPolicyExpanded(!isPolicyExpanded);
  };

  const toggleNormsExpand = () => {
    setIsNormsExpanded(!isNormsExpanded);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  return (
    <>
      <CustomNavbar />
      {/* <Timer /> */}
      <div className="guest_bg">
        <div className="guest-details-container">
          <div>
            <div className="hotel_left">
              <h2 className="section-title">
                Guest <span style={{ color: "#00b7eb" }}>Details</span>
              </h2>
              <div className="details-wrapper">
                <div className="left-side">
                  <h3>
                    {bookingDetails.hotelname || "Hotel Name not available"}
                  </h3>
                  {/* <h5>{bookingDetails.addressLine1 || "Address not available"}</h5> */}
                </div>
                <div className="right-side">
                  <p>
                    <strong>Check-in Date:</strong>{" "}
                    {bookingDetails.check_in_date ||
                      "Check-in date not available"}
                  </p>
                </div>
              </div>
              <Row>
                <Col md={6}>
                  <div className="hotel-policies">
                    {/* Hotel Policies Section */}
                    {blockRoomResult?.HotelPolicyDetail ? (
                      <div className="hotel-policy">
                        <h4>Policy Details</h4>
                        <div>
                          {isPolicyExpanded ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: cleanUpDescription(
                                  blockRoomResult.HotelPolicyDetail
                                ),
                              }}
                            />
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: cleanUpDescription(
                                  truncateText(
                                    blockRoomResult.HotelPolicyDetail,
                                    200
                                  ) // Truncate after 200 characters
                                ),
                              }}
                            />
                          )}
                        </div>
                        <button
                          className="btn btn-link"
                          onClick={togglePolicyExpand}
                        >
                          {isPolicyExpanded ? "Show Less" : "Read More"}
                        </button>
                      </div>
                    ) : (
                      <p>No hotel policy details available.</p>
                    )}

                    {/* Hotel Norms Section */}
                    {blockRoomResult?.HotelNorms ? (
                      <div className="hotel-policy">
                        <h4>Hotel Norms</h4>
                        <div>
                          {isNormsExpanded ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: cleanUpDescription(
                                  blockRoomResult.HotelNorms
                                ),
                              }}
                            />
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: cleanUpDescription(
                                  truncateText(blockRoomResult.HotelNorms, 200) // Truncate after 200 characters
                                ),
                              }}
                            />
                          )}
                        </div>
                        <button
                          className="btn btn-link"
                          onClick={toggleNormsExpand}
                        >
                          {isNormsExpanded ? "Show Less" : "Read More"}
                        </button>
                      </div>
                    ) : (
                      <p>No hotel norms available.</p>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="hotel-right">
                    <div className="price-hotel">
                      <h6>
                        <i className="room-price"></i> <span>Price Details</span>
                      </h6>
                      <div className="price_head">
                        <div className="room_type">
                          <span>Room type</span>
                          <small>{bookingDetails.room_type_name || "N/A"}</small>
                        </div>

                        <div className="total-hotel_price">
                          <span>Total Price</span>
                          <small> {bookingDetails.roomprice || "N/A"}</small>
                        </div>

                        <div className="room_type">
                          <span>Discount</span>
                          <small>{bookingDetails.discount || 0} %</small>
                        </div>
                        <div className="room_type">
                          <span>IGST </span>
                          <small> {bookingDetails.igst || "N/A"} %</small>
                        </div>
                        <div className="total_room">
                          <span>Total Room</span>
                          <small> {bookingDetails.noofrooms || "N/A"}</small>
                        </div>
                        <div className="final_price">
                          <span>Total Payment</span>
                          <small>₹{totalPrice}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>



          </div>
          {!showForm && (
            <button className="submit-btn" onClick={() => setShowForm(true)}>
              Add Details
            </button>
          )}

          {showForm && !formSubmitted && (
            <div className="form-container">
              <div className="form-content">
                <h2 className="text-center">
                  Enter Guest {currentGuestIndex + 1} Details
                </h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="guest-form">
                    <div className="row">
                      <div className="col-md-6">
                        {/* First Name */}
                        <div className="mb-3 req_field">
                          <label className="required_field">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            name="fname"
                            value={guestForms[currentGuestIndex].fname}
                            onChange={handleFormChange}
                            required
                            minLength={2}
                            maxLength={30}
                          />
                        </div>

                        {/* Middle Name */}
                        <div className="mb-3 req_field">
                          <label>Middle Name (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Middle Name"
                            name="mname"
                            value={guestForms[currentGuestIndex].mname}
                            onChange={handleFormChange}
                          />
                        </div>

                        {/* Last Name */}
                        <div className="mb-3 req_field">
                          <label className="required_field">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            name="lname"
                            value={guestForms[currentGuestIndex].lname}
                            onChange={handleFormChange}
                            required
                            minLength={2}
                            maxLength={30}
                          />
                        </div>

                        {/* Email */}
                        <div className="mb-3 req_field">
                          <label className="required_field">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={guestForms[currentGuestIndex].email}
                            onChange={handleFormChange}
                            required
                          />
                        </div>

                        {/* Age */}
                        <div className="mb-3 req_field">
                          <label className="required_field">Age</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Age"
                            name="age"
                            value={guestForms[currentGuestIndex].age}
                            onChange={handleFormChange}
                            min={0}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        {/* Contact Number */}
                        <div className="mb-3 req_field">
                          <label className="required_field">
                            Contact Number
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="Contact Number"
                            name="mobile"
                            value={guestForms[currentGuestIndex].mobile}
                            onChange={handleFormChange}
                            required
                            pattern="[0-9]{10}"
                          />
                        </div>

                        {/* PAN No. */}
                        <div className="mb-3 passport_field">
                          <label>PAN No.</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="PAN No."
                            name="pan"
                            value={guestForms[currentGuestIndex].pan}
                            onChange={handleFormChange}
                          />
                        </div>

                        {/* Passport No. */}
                        <div className="mb-3 passport_field">
                          <label>Passport No.</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Passport No."
                            name="passportNo"
                            value={guestForms[currentGuestIndex].passportNo}
                            onChange={handleFormChange}
                          />
                        </div>

                        {/* Lead Passenger */}
                        <div className="mb-3 req_field">
                          <label className="required_field">
                            Lead Passenger
                          </label>
                          <select
                            className="form-control"
                            name="leadPassenger"
                            value={guestForms[currentGuestIndex].leadPassenger}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Pax Type */}
                        <div className="mb-3 req_field">
                          <label className="required_field">Pax Type</label>
                          <select
                            className="form-control"
                            name="paxType"
                            value={guestForms[currentGuestIndex].paxType}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            <option value="1">Adult</option>
                            <option value="2">Child</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button className="submit-btn" type="submit">
                      {currentGuestIndex + 1 < guestForms.length
                        ? "Save and Next"
                        : "Save and Finish"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {formSubmitted && (
            <div>
              <Popup
                show={showPopup}
                onClose={handleClosePopup}
                formData={guestForms}
              />
              <label className="check_btn">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={handleCheckboxChange}
                />
                Confirm details are correct
              </label>
              <button
                disabled={!checkboxChecked}
                className="submit-btn"
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};
export default GuestDetails;
// -----------------------------------------------------
