import './FlightTickect.css';
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';

const FlightTickect = () => {




  const handleCancelTicket = async () => {
    const confirmation = window.confirm("Are you sure you want to cancel?");
    if (confirmation) {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/seat-cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusId: "11836",
            SeatId: "25SYK4ET",
            Remarks: "test",
            transaction_num: "null"
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

  return (
    <>
      <CustomNavbar />

      <div className='flighttikts'>
        <div class="b-hed"><h5>Download Ticket Status</h5></div>
        <section className="flightticktSec">
          <div className="container">
            <div className="row flightticktROW">
              <div className="col-md-6 flightticktCOL">
                <div>
                  <h5 className='flighttikhed'>Flight Ticket</h5>
                </div>
                <div className='wwww'>
                  <p><strong>Passenger Name -: </strong><span></span></p>
                  <p><strong>Age -: </strong><span></span></p>
                  <p><strong>Gender -: </strong><span></span></p>
                  <p><strong>Number -: </strong><span></span></p>
                  <p><strong>Address -: </strong><span></span></p>
                  <p><strong>Departure Time -: </strong><span></span></p>
                  <p><strong>Arrival Time -: </strong><span></span></p>
                  <p><strong>Airline Name -: </strong><span></span></p>
                </div>
                <div className="cancelbusticket">
                  <button onClick={handleCancelTicket}>Cancel Ticket</button>
                </div>
                <div className="btm">
                  <button>DOWNLOAD <i className="ri-download-line"></i></button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};

export default FlightTickect;
