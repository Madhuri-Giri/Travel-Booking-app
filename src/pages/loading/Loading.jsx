import loaderGif from "../../assets/images/giphy.gif"
import "./Loading.css"

const Loading = () => {
  return (
    <div className='loading'>
       <img src={loaderGif} alt="Loading..." className="loading-gif" />
       <h5>Loading...</h5>
    </div>
  )
}

export default Loading