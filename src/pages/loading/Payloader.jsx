import payloader from "../../assets/images/payloader.gif"
import "./Payloader.css"

const Payloader = () => {
  return (
    <div className='payload'>
       <img  src={payloader} alt="Loading..." className="payloader-gif" />
       <h5>Payment Update Successfull...</h5>
    </div>
  )
}

export default Payloader