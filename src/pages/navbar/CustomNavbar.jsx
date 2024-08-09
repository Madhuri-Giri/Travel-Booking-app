import "./CustomNavbar.css"
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { LuUserPlus } from "react-icons/lu";
import { RiBookmark3Fill, RiHotelBedFill } from "react-icons/ri";
import { GiCommercialAirplane } from 'react-icons/gi';
import { TbBus } from "react-icons/tb";
import { PiSuitcaseSimpleDuotone } from "react-icons/pi";
import { BsBookmarkStarFill } from "react-icons/bs";
import MainLogo from "../../assets/images/main logo.png"
import { FaDownload } from "react-icons/fa6";
import { FaPlaneDeparture } from "react-icons/fa";
import { FaBusAlt } from "react-icons/fa";


const CustomNavbar = () => {
    return (
        <>
            <Navbar expand="lg" className="mainNavbar">
                <Container>

                    <Navbar.Brand href="/" className='navbarlogo'>
                        <img src={MainLogo} className='img-fluid logoimg' alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto navmenuss">
                            <Nav.Link
                                href="/flight-search"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/flight-search' ? 'active' : ''} , ${location.pathname === '/flight-list' ? 'active' : ''} , ${location.pathname === '/flight-details' ? "active" : ''} , ${location.pathname === '/seat-meal-baggage' ? 'active' : ''} , ${location.pathname === '/flight-review' ? 'active' : ''} `}
                            >
                                <GiCommercialAirplane className="icon" size={20} />
                                <span className="textNav">FLIGHT</span>
                            </Nav.Link>
                            <Nav.Link
                                href="/bus-search"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/bus-search' ? 'active' : ''} , ${location.pathname === '/bus-list' ? 'active' : ''} `}
                            >
                                <FaBusAlt className="icon" size={22} />
                                <span className="textNav">BUS</span>
                            </Nav.Link>
                            <Nav.Link
                                href="/hotel-search"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/hotel-search' ? 'active' : ''} , ${location.pathname === '/hotel-list' ? 'active' : ''}`}
                            >
                                <RiHotelBedFill className="icon" size={22} />
                                <span className="textNav">HOTEL</span>
                            </Nav.Link>
                            {/* <Nav.Link
                                href="/package"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/package' ? 'active' : ''}`}
                            >
                                <PiSuitcaseSimpleDuotone className="icon" size={20} />
                                <span className="textNav">PACKAGE</span>
                            </Nav.Link> */}
                            <Nav.Link
                                href="/my-trips"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/my-trips' ? 'active' : ''}`}
                            >
                                <BsBookmarkStarFill className="icon" size={20} />
                                <span className="textNav">MY TRIPS</span>
                            </Nav.Link>
                        </Nav>
                        <Nav className="navcornerr">
                            <Nav.Link href="" className='numNavbar'> <FaPhoneAlt /> <span>+91 9876543210</span> </Nav.Link>

                            <div className="mobileLoginSignup">
                                <Nav.Link href="/login" className='mobileLoginNavbar'> <span><MdLogin size={20} /> Login</span> </Nav.Link>
                                <Nav.Link href="/signup" className='mobileSignupNavbar'> <span><LuUserPlus size={20} /> Signup</span> </Nav.Link>
                            </div>

                            <NavDropdown
                                title={<> <FaCircleUser /> </>}
                                id="basic-nav-dropdown" className="userDropdown">
                                <NavDropdown.Item href="/login"> <MdLogin size={20} /> Login</NavDropdown.Item>
                                <NavDropdown.Item href="/signup"> <LuUserPlus size={20} /> Signup</NavDropdown.Item>
                                <NavDropdown.Item href="/profile"> <FaCircleUser size={20} /> Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/setting"> <RiBookmark3Fill size={20} /> Settings</NavDropdown.Item>
                                {/* <NavDropdown.Item href="/"> <FaDownload  size={20} /> Tickets</NavDropdown.Item> */}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>

            {/* mobile header for bookings */}
            <div className="container-fluid mobilehedrbookings">
                <div className="row">
                    <div className={`col-4 ${location.pathname === '/flight-search' ? 'active-link' : ''} , ${location.pathname === '/' ? 'active-link' : ''}`}>
                        <div>
                        <NavLink to='/flight-search'>
                            <FaPlaneDeparture  className="icon" />
                            Flight
                        </NavLink>
                        </div>
                    </div>
                    <div className={`col-4 ${location.pathname === '/bus-search' ? 'active-link' : ''}`}>
                       <div>
                       <NavLink to='/bus-search'>
                            <FaBusAlt  className="icon" />
                            Bus
                        </NavLink>
                       </div>
                    </div>
                    <div className={`col-4 ${location.pathname === '/hotel-search' ? 'active-link' : ''}`}>
                       <div>
                       <NavLink to='/hotel-search'>
                            <RiHotelBedFill className="icon" />
                            Hotel
                        </NavLink>
                       </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CustomNavbar 