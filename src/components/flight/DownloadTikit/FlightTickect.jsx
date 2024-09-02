import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./FlightTickect.css"; // Ensure your CSS file is set up correctly
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import LootiAnim from '../../../assets/images/Anim.json';
import { FaArrowRightLong } from "react-icons/fa6";
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const FlightTickect = () => {
  const passcode = generatePasscode();

  const [flightticketPassengerDetails, setflightticketPassengerDetails] = useState(null);

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  useEffect(() => {
    const fetchFlightTicketApiData = async () => {
      try {
        const transactionFlightNo = localStorage.getItem('transactionNum-Flight');

        const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-ticket-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_num: transactionFlightNo,
          }),
        });

        const data = await response.json();
        setflightticketPassengerDetails(data);
        console.log('flight ticket API Response:', data);

      } catch (error) {
        console.error("Error fetching API of flight ticket:", error);
      }
    };
    fetchFlightTicketApiData();
  }, []);


  // Function to download the flight ticket as a PDF
  const downloadTicket = () => {
    // Ensure the flight ticket details are available
    

    // Find the .flightTicketmain element specifically
    const flightTicketMain = document.querySelector('.flightTicketmain');

    // Check if the flightTicketMain element exists
    if (!flightTicketMain) {
      console.error("Flight ticket main content not found");
      return;
    }

    // Hide any other elements not needed in the PDF
    const btmDiv = document.querySelector('.btm');
    if (btmDiv) {
      btmDiv.style.display = 'none';
    }

    // Capture the flight ticket main content as an image
    html2canvas(flightTicketMain, { scale: 2 }).then((canvas) => {
      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save('flight_ticket.pdf');
    }).catch((error) => {
      // Log error if canvas generation fails
      console.error('Error generating PDF:', error);
    }).finally(() => {
      // Restore visibility of elements that were hidden
      if (btmDiv) {
        btmDiv.style.display = '';
      }
    });
  };


  // const downloadTicket = () => {
  //   if (!flightticketPassengerDetails || !flightticketPassengerDetails.user_details) {
  //     console.error("Missing flight ticket details or passenger data");
  //     return;
  //   }

  //   const doc = new jsPDF();

  //   const userDetail = flightticketPassengerDetails.user_details[0];

  //   doc.text("Flight Ticket", 20, 20);

  //   doc.autoTable({
  //     startY: 30,
  //     head: [['Detail', 'Information']],
  //     body: [
  //       ['Name:', userDetail.name || 'N/A'],
  //       ['Email:', userDetail.email || 'N/A'],
  //       ['Mobile:', userDetail.mobile || 'N/A'],
  //       ['Registration Number:', userDetail.registration_number || 'N/A'],
  //       ['Status:', flightticketPassengerDetails.status === 200 ? 'Confirmed' : 'Pending'],
  //     ],
  //   });

  //   doc.save('flight_ticket.pdf');
  // };

  const handleCancelTicket = async () => {
    const confirmation = window.confirm("Are you sure you want to cancel?");
    if (confirmation) {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            RequestType: "2",
            TraceId: "123456"
          }),
        });

        if (response.ok) {
          toast.success("Your ticket is canceled");
          console.log("Your ticket is canceled");
        } else {
          toast.error("Failed to cancel the ticket");
        }
      } catch (error) {
        console.error("Error canceling the ticket:", error);
        toast.error("An error occurred while canceling the ticket");
      }
    } else {
      console.log("Ticket cancellation aborted");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const passengers = [
    { name: 'John Doe', type: 'Adult', pnr: 'ABC123', eTicket: '1234567890', seat: '12A' },
  ];


  return (
    <>
      <CustomNavbar />

      <div className="Bus-Tikit">
        <div className="lottie container">
          {/* {flightticketPassengerDetails && flightticketPassengerDetails.user_details && (
            flightticketPassengerDetails.user_details.map((userDetail, index) => ( */}
          {/* <div key={index} className="row"> */}
          <div className="row">
            <div className="col-lg-3">
              <Lottie animationData={LootiAnim} />
            </div>
            <div className="col-lg-9">
              <div className="fligthticketBtns">
                <button className='busdonload' onClick={downloadTicket}>
                  Download
                  <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                </button>
              </div>
              <div className='flightTicketmain'>
                <div className='flightticketboxHED'>
                  <h6>Thu,25 May 23</h6>
                  <h6>KOLKATA TO DELHI</h6>
                  <p>2h 20m</p>
                </div>
                <div className="flightticketboxTravelDetails">
                  <div className="ffbox1">
                    <div className='flightIndigodet'>
                      <p>Indigo</p>
                      <p>6E-2345</p>
                    </div>
                    <div className='flightSaver'>
                      <h6>Regular Fare</h6>
                      <h6>SAVER</h6>
                    </div>
                  </div>
                  <div className="ffbox2">
                    <h4>CCU</h4>
                    <p className='ffbox2P1'>KOLKATA</p>
                    <p className='ffbox2Time'>10:10 hrs , 25 May</p>
                    <p>Netaji Sbhas Chandra Bose International Airport</p>
                  </div>
                  <div className="ffbox3">
                    <p>---</p>
                    <p className='ffbox3TImeborder'>2h 20m</p>
                    <p>Economy</p>
                  </div>
                  <div className="ffbox4">
                    <h4>DEL</h4>
                    <p className='ffbox4P1'>DELHI</p>
                    <p className='ffbox2Time'>10:10 hrs , 25 May</p>
                    <p>Indira Gandhi International AIrport. Terminal 2</p>
                  </div>

                </div>
                <div className="">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead className='passengerDetailTable'>
                      <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>PASSENGER NAME</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>PNR</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>E-TICKET NO.</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>SEAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengers.map((passenger, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>1. {passenger.name}</strong> , <span style={{ color: 'grey' }}>{passenger.type}</span> </td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{passenger.pnr}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{passenger.eTicket}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{passenger.seat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-9">
                  <div className='busticktbox'>
                    <div className='bustickthed'>
                      <h5>Flight Ticket</h5>
                    </div>
                    <div className="top"></div>
                    <div className="row buspssngerdetails">
                      <div className="col-12">
                        <div className="row">
                          <div className='fromtoMOB'>
                            <div>
                              <strong>{from}</strong>
                              <p>{formatTime(userDetail.updated_at)}</p>
                            </div>
                            <div>
                              <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                            </div>
                            <div>
                              <strong>{to}</strong>
                              <p>{formatTime(userDetail.created_at)}</p>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>Name -: </strong><span>{userDetail.name}</span></p>
                            <p><strong>Email -: </strong><span>{userDetail.email}</span></p>
                            <div className='fromtoWEB'>
                              <div>
                                <strong>{from}</strong>
                                <p>{formatTime(userDetail.updated_at)}</p>
                              </div>
                              <div>
                                <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                              </div>
                              <div>
                                <strong>{to}</strong>
                                <p>{formatTime(userDetail.created_at)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>Mobile -: </strong><span>{userDetail.mobile}</span></p>
                            <p className='psngerstatus'><strong>Status -: </strong><span>{flightticketPassengerDetails.status === 200 ? 'Confirmed' : 'Pending'}</span></p>
                          </div>
                          <div className="col-md-4 ticktbordr">
                            <div>
                              <p><strong>Registration No -: </strong><span>{userDetail.registration_number}</span></p>
                              <p><strong>Passcode: </strong></p>
                              <Barcode className="buspasscode" value={passcode} format="CODE128" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="btm">
                      <button className='busdonload' onClick={downloadTicket}>
                        Download
                        <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                      </button>
                      <button className='buscncl' style={{ backgroundColor: 'red' }} onClick={handleCancelTicket}>Cancel Ticket</button>
                    </div>
                  </div>
                </div> */}
          </div>
          {/* //   ))
          // )} */}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default FlightTickect;
