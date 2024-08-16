import "./CustomNavbar.css";
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { LuUserPlus } from "react-icons/lu";
import { RiBookmark3Fill, RiHotelBedFill } from "react-icons/ri";
import { GiCommercialAirplane } from 'react-icons/gi';
import { BsBookmarkStarFill } from "react-icons/bs";
import MainLogo from "../../assets/images/main logo.png";
import FlightLogo from "../../assets/images/plane.png";
import BusLogo from "../../assets/images/bus.png";
import HotelLogo from "../../assets/images/five-stars.png";
import { LuBus } from "react-icons/lu";

const CustomNavbar = () => {
    return (
        <>
            <Navbar expand="lg" className="mainNavbar">
                <Container>
                    <Navbar.Brand as={NavLink} to="/" className='navbarlogo'>
                        <img src={MainLogo} className='img-fluid logoimg' alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />

                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="start"
                        className="offcanvasNavbar"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="mx-auto navmenuss">
                                <NavLink
                                    to="/flight-search"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/flight-search' || location.pathname === '/flight-list' || location.pathname === '/flight-Farequote' || location.pathname === '/flight-details' || location.pathname === '/seat-meal-baggage' || location.pathname === '/flight-review' || location.pathname === '/flight-ticket-download' ? 'active' : ''}`}
                                >
                                    <GiCommercialAirplane className="icon" size={20} />
                                    <span className="textNav">FLIGHTS</span>
                                </NavLink>
                                <NavLink
                                    to="/bus-search"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/bus-search' || location.pathname === '/bus-list' || location.pathname === '/bus-layout' || location.pathname === '/bord-drop' || location.pathname === '/review-booking' || location.pathname === '/bus-tikit-download' ? 'active' : ''}`}
                                >
                                    <LuBus className="icon" size={22} />
                                    <span className="textNav">BUSES</span>
                                </NavLink>
                                <NavLink
                                    to="/hotel-search"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/hotel-search' || location.pathname === '/hotel-list' || location.pathname === '/hotel-description' || location.pathname === '/hotel-room' || location.pathname === '/hotel-guest' ? 'active' : ''}`}
                                >
                                    <RiHotelBedFill className="icon" size={22} />
                                    <span className="textNav">HOTELS</span>
                                </NavLink>
                                <NavLink
                                    to="/my-trips"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/my-trips' ? 'active' : ''}`}
                                >
                                    <BsBookmarkStarFill className="icon" size={20} />
                                    <span className="textNav">MY TRIPS</span>
                                </NavLink>
                            </Nav>
                            <Nav className="navcornerr">
                                <NavLink to="" className='numNavbar'>
                                    <FaPhoneAlt /> <span>+91 9876543210</span>
                                </NavLink>
                                <div className="mobileLoginSignup">
                                    <NavLink to="/login" className='mobileLoginNavbar'>
                                        <span><MdLogin size={20} /> Login</span>
                                    </NavLink>
                                    <NavLink to="/signup" className='mobileSignupNavbar'>
                                        <span><LuUserPlus size={20} /> Signup</span>
                                    </NavLink>
                                </div>
                                <NavDropdown title={<> <FaCircleUser /> </>} id="basic-nav-dropdown" className="userDropdown">
                                    <NavDropdown.Item as={NavLink} to="/login">
                                        <MdLogin size={20} /> Login
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/signup">
                                        <LuUserPlus size={20} /> Signup
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/profile">
                                        <FaCircleUser size={20} /> Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/setting">
                                        <RiBookmark3Fill size={20} /> Settings
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            {/* Mobile header for bookings */}
            <div className="container-fluid mobilehedrbookings">
                <div className="row">
                    <div className={`col-4 ${location.pathname === '/flight-search' || location.pathname === '/' ? 'active-link' : ''}`}>
                        <NavLink to='/flight-search'>
                            <img height={5} src={FlightLogo} className='img-fluid' alt="logo"></img><br />
                            Flight
                        </NavLink>
                    </div>
                    <div className={`col-4 ${location.pathname === '/bus-search' ? 'active-link' : ''}`}>
                        <NavLink to='/bus-search'>
                            <img height={5} src={BusLogo} className='img-fluid' alt="logo"></img><br />
                            Bus
                        </NavLink>
                    </div>
                    <div className={`col-4 ${location.pathname === '/hotel-search' ? 'active-link' : ''}`}>
                        <NavLink to='/hotel-search'>
                            <img height={5} src={HotelLogo} className='img-fluid' alt="logo"></img><br />
                            Hotel
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomNavbar;
