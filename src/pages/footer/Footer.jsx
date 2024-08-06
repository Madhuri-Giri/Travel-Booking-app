import "./Footer.css"
import { Link } from 'react-router-dom';
import { FaFacebookF , FaInstagram , FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import FooterLogo from "../../assets/images/main logo.png"
import paymentmode from '../../../src/assets/images/paymentmode.png';
function Footer() {
    return (
        <>

            <section className='footer-sec'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 footerabout">
                            <img height={40} src={FooterLogo} className='img-fluid logoimg' alt="logo"></img>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ad nisi repudiandae nobis minima</p>
                            <div className='footer-icons'>
                                <Link to='/'> <FaFacebookF /> </Link>
                                <Link to='/'> <FaTwitter />   </Link>
                                <Link to='/'> <FaLinkedinIn /> </Link>
                                <Link to='/'> <FaInstagram /> </Link>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-4 col-sm-6 footer-links">
                            <h5>Supports</h5>
                            <IoMdArrowDropright /> <Link to='/Faq'>Faq</Link> <br></br>
                            <IoMdArrowDropright /> <Link to='/help'>Help</Link> <br></br>
                            <IoMdArrowDropright /> <Link to='/review'>Review</Link> <br></br>
                            <IoMdArrowDropright /> <Link to='/setting'>Settings</Link> <br></br>
                        </div>

                        <div className="col-lg-2 col-md-4 col-sm-6 footer-links">
                            <h5>Quick Links</h5>
                            <IoMdArrowDropright /> <Link to='/flight-search'>Flights</Link> <br></br>
                            <IoMdArrowDropright /> <Link to='/bus-search'>Bus</Link> <br></br>
                            <IoMdArrowDropright /> <Link to='/hotel-search'>Hotel</Link> <br></br>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6 footer-links">
                            <h5>Get in Touch</h5>
                            <div> <span>Email : </span> example@gmail.com </div>
                            <div> <span>Phone : </span> +1234567899 </div>
                            <div> <span>Fax : </span> +1 (987)  793805</div>                            
                        </div>

                        <div className="col-lg-2 col-sm-6 footer-links">
                            <h5>Payment Mode</h5>
                            <img src={paymentmode} className='img-fluid' alt="logo" />
                        </div>
                        
                    </div>
                </div>
                    <div className="footrcopyright">
                    <p>© 2024 <Link to=''>Sajyatra</Link>. All Rights Reserved.</p>
                    </div>
            </section>

        </>
    )
}

export default Footer