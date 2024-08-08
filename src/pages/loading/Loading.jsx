import loaderGif from "../../assets/images/lg.gif"
import "./Loading.css"

const Loading = () => {
  return (
    <div className='loading'>
       <img src={loaderGif} alt="Loading..." className="loading-gif" />
    </div>
  )
}

export default Loading