import React from 'react'
import "./ReviewBooking.css"
import { useNavigate } from 'react-router-dom'

const ReviewBooking = () => {
   const navigate = useNavigate()

  const back = () => {
   navigate('/passenger-list')
  }


  return (
   <>

     <div className='ReviewBooking'>
    <div className="review-book">

          <h5><i onClick={back} className="ri-arrow-left-s-line"></i> Review Booking</h5> 
          <div className="test-account">
                    <h6>Testing Account</h6>
                    <div className="sdfgh">
                    <div className="test-left">
                            <p>Brand East</p>
                            <div className="d-t">
                              <span>Jul 01</span>
                              <span>10:00 PM</span>
                            </div>
                    </div>
                    <div className="test-right">
                           <p>Pune University</p>
                            <div className="d-t">
                              <span>Jul 03</span>
                              <span>10:00 PM</span>
                            </div>
                    </div>
                    </div>
          </div>


          {/* <div className="detail-flex"> */}
          <div className="p-detail">
                    <h6>Pessanger Detail</h6>
                    <div className="kuchbhi">
                          <p>Name: Tansiha</p>  
                          <p>Age: 18yr</p>  
                    </div>
          </div>

          <div className="p-contact-detail">
                    <h6>Contact Details</h6>
                    <p>We'll send you ticket here</p>
                    <form>
                    <div className="p-form">
                     <label>Email</label>
                    <input type="email" name='email' placeholder='Enter Email' required/>
                    </div> 
                    <div className="p-form">
                     <label>Phone No.</label>
                    <input type="mobile" name='moile' placeholder='Enter Phone No.' required/>
                    </div> 
                    </form>
          </div>
          {/* </div> */}

         

          <div className="last-pay">
                    <div className="fare">
                              <h6>Total fare</h6>
                              <small>$105</small>
                    </div>
                     <div className="review-pay">
                     <button>Proceed To Pay</button>
                     </div>
          </div>

</div>
</div>
   
   </>
  )
}

export default ReviewBooking