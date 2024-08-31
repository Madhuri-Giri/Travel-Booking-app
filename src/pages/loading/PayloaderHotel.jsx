import payloader from "../../assets/images/payment.gif"
// import "./Payloader.css"

const PayloaderHotel = () => {
  return (
    <div className='payload'>
       <img  src={payloader} alt="Loading..." className="" />
       <h5>Payment updated successfully. please wait your  booking is processing.</h5>
    </div>
  )
}

export default PayloaderHotel