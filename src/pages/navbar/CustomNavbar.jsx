/* eslint-disable no-unused-vars */
import "./CustomNavbar.css"
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { FaCircleUser, FaRegUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { LuUserPlus } from "react-icons/lu";
import { GiCommercialAirplane } from 'react-icons/gi';
import { BsBookmarkStarFill } from "react-icons/bs";
import MainLogo from "../../assets/images/main logo.png"
import BusLogo from "../../assets/images/bus.png"
import FlightLogo from "../../assets/images/plane.png"
import HotelLogo from "../../assets/images/five-stars.png"
import { IoBusOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { userLogout } from "../../API/loginAction";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const CustomNavbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { isLogin, } = useSelector((state) => state.loginReducer);

    const handleLogout = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(userLogout({ navigate }));
            }
        });

    };
    console.log('navisLogin', isLogin);
    const loginData = JSON.parse(localStorage.getItem("loginData"))

    return (
        <>
            <Navbar expand="lg" className="mainNavbar">
                <Container>
                    <Navbar.Brand href="/" className='navbarlogo'>
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
                                <Nav.Link
                                    href="/flight-search"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/flight-search' || location.pathname === '/flight-list' || location.pathname === '/flight-Farequote' || location.pathname === '/flight-details' || location.pathname === '/seat-meal-baggage' || location.pathname === '/flight-review' || location.pathname === '/flight-ticket-download' ? 'active' : ''}`}
                                >
                                    <GiCommercialAirplane className="icon" size={20} />
                                    <span className="textNav">FLIGHTS</span>
                                </Nav.Link>
                                <Nav.Link
                                    href="/bus-search"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/bus-search' || location.pathname === '/bus-list' || location.pathname === '/bus-layout' || location.pathname === '/bord-drop' || location.pathname === '/review-booking' || location.pathname === '/bus-tikit-download' ? 'active' : ''}`}
                                >
                                    <IoBusOutline className="icon" size={22} />
                                    <span className="textNav">BUSES</span>
                                </Nav.Link>
                                <Nav.Link
                                    href="/hotel-search"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/hotel-search' || location.pathname === '/hotel-list' || location.pathname === '/hotel-description' || location.pathname === '/hotel-room' || location.pathname === '/hotel-guest' ? 'active' : ''}`}
                                >
                                    <RiHotelLine className="icon" size={22} />
                                    <span className="textNav">HOTELS</span>
                                </Nav.Link>
                                <Nav.Link
                                    href="/booking-history"
                                    className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/booking-history' ? 'active' : ''}`}
                                >
                                    <BsBookmarkStarFill className="icon" size={20} />
                                    <span className="textNav">BOOKINGS</span>
                                </Nav.Link>
                            </Nav>
                            <Nav className="navcornerr">
                                <div className="mobilesetpro">
                                    <Nav.Link href="/profile">
                                        <FaRegUser className="icon" size={20} />
                                        <span className="mobtextNav">Profile</span>
                                    </Nav.Link>
                                    <Nav.Link href="/setting">
                                        <IoSettingsOutline className="icon" size={20} />
                                        <span className="mobtextNav">Settings</span>
                                    </Nav.Link>
                                </div>

                                {isLogin &&
                                    (
                                        <Nav.Link href="" className="numNavbar">
                                            <span> {loginData?.name} </span>
                                        </Nav.Link>
                                    )
                                }

                                <div className="mobileLoginSignup">
                                    {isLogin ? (
                                        <Nav.Link onClick={handleLogout} className="mobileLoginNavbar">
                                            <span><MdLogin size={20} /> Logout</span>
                                        </Nav.Link>
                                    ) : (
                                        <>
                                            <Nav.Link href="/enter-number" className="mobileLoginNavbar">
                                                <span><MdLogin size={20} /> Login</span>
                                            </Nav.Link>
                                            <Nav.Link href="/signup" className="mobileSignupNavbar">
                                                <span><LuUserPlus size={20} /> Signup</span>
                                            </Nav.Link>
                                        </>
                                    )}
                                </div>
                                <NavDropdown title={<FaCircleUser />} id="basic-nav-dropdown" className="userDropdown">
                                    {isLogin &&
                                        (<NavDropdown.Item href="/profile">
                                            <FaRegUser size={20} /> Profile
                                        </NavDropdown.Item>)
                                    }

                                    <NavDropdown.Item href="/setting">
                                        <IoSettingsOutline size={20} /> Settings
                                    </NavDropdown.Item>
                                    {isLogin ? (
                                        <NavDropdown.Item onClick={handleLogout}>
                                            <MdLogin size={20} /> Logout
                                        </NavDropdown.Item>
                                    ) : (
                                        <>
                                            <NavDropdown.Item href="/enter-number">
                                                <MdLogin size={20} /> Login
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="/signup">
                                                <LuUserPlus size={20} /> Signup
                                            </NavDropdown.Item>
                                        </>
                                    )}
                                </NavDropdown>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            {/* mobile header for bookings */}
            <div className="container-fluid mobilehedrbookings">
                <div className="row">
                    <div className={`col-4 ${location.pathname === '/flight-search' || location.pathname === '/' ? 'active-link' : ''}`}>
                        <NavLink to='/flight-search'>
                            {/* <FaPlaneDeparture className="icon" /> */}
                            <img height={5} src={FlightLogo} className='img-fluid' alt="logo"></img><br></br>
                            Flight
                        </NavLink>
                    </div>
                    <div className={`col-4 ${location.pathname === '/bus-search' ? 'active-link' : ''}`}>
                        <NavLink to='/bus-search'>
                            {/* <FaBusAlt className="icon" /> */}
                            <img height={5} src={BusLogo} className='img-fluid' alt="logo"></img><br></br>
                            Bus
                        </NavLink>
                    </div>
                    <div className={`col-4 ${location.pathname === '/hotel-search' ? 'active-link' : ''}`}>
                        <NavLink to='/hotel-search'>
                            {/* <RiHotelBedFill className="icon" /> */}
                            <img height={5} src={HotelLogo} className='img-fluid' alt="logo"></img><br></br>
                            Hotel
                        </NavLink>
                    </div>
                </div>
            </div>




        </>
    )
}

export default CustomNavbar 