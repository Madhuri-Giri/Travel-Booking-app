
const FlightReview = () => {


          // -----------------------flight LLC Api----------------------------------------------

                    const llcHandler = async () => {

                    const llcpayload = {

                    };

                    try {
                              const response = await fetch('', {
                                        method: 'POST',
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(llcpayload)
                              });

                              if (!response.ok) {
                                        throw new Error('Network response was not ok');
                              }

                              const llcData = await response.json();
                              console.log('LLC Respose:', llcData);

                    } catch (error) {
                              console.error('API call failed:', error);
                    }
          }
          llcHandler()

          // ---------------------------------------Hold Api--------------------------------------------

          const holdapiHandler = async () => {

                    const holdpayload = {

                    };

                    try {
                              const response = await fetch('', {
                                        method: 'POST',
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(holdpayload)
                              });

                              if (!response.ok) {
                                        throw new Error('Network response was not ok');
                              }

                              const holdData = await response.json();
                              console.log('LLC Respose:', holdData);

                    } catch (error) {
                              console.error('API call failed:', error);
                    }
          }
          holdapiHandler()

          // -------------------------------------------------------------------------------------------


          return (
                    <div>
                              <h5>Review Your Trip Details</h5>

                              <div className="flight-pay">
                                        <button>Proceed To Pay</button>
                              </div>
                    </div>
          )
}

export default FlightReview