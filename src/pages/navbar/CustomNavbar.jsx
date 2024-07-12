import "./CustomNavbar.css"
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaPhoneAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { LuUserPlus } from "react-icons/lu";
import { RiBookmark3Fill , RiHotelBedFill } from "react-icons/ri";
import { GiCommercialAirplane } from 'react-icons/gi'; 
import { TbBus } from "react-icons/tb";
import { PiSuitcaseSimpleDuotone } from "react-icons/pi";
import { BsBookmarkStarFill } from "react-icons/bs";

const CustomNavbar = () => {
    return (
        <>
            <Navbar expand="lg" className="mainNavbar">
                <Container>
                    <Navbar.Brand href="/home" className='navbarlogo'>
                        <img src='/src/assets/images/download-removebg-preview.png' className='img-fluid logoimg' alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto navmenuss">
                            <Nav.Link
                                href="/"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/' ? 'active' : ''}`}
                            >
                                <GiCommercialAirplane className="icon" size={20} />
                                <span className="textNav">FLIGHTS</span>
                            </Nav.Link>
                            <Nav.Link
                                href="/bus-search"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/bus-search' ? 'active' : ''}`}
                            >
                                <TbBus className="icon" size={22} />
                                <span className="textNav">BUSES</span>
                            </Nav.Link>
                            <Nav.Link
                                href="/hotel-search"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/hotel-search' ? 'active' : ''}`}
                            >
                                <RiHotelBedFill className="icon" size={22} />
                                <span className="textNav">HOTELS</span>
                            </Nav.Link>
                            <Nav.Link
                                href="/package"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/package' ? 'active' : ''}`}
                            >
                                <PiSuitcaseSimpleDuotone className="icon" size={20} />
                                <span className="textNav">PACKAGE</span>
                            </Nav.Link>
                            <Nav.Link
                                href="/my-trips"
                                className={`homnavbbookingicon homvanlinkss align-items-center ${location.pathname === '/my-trips' ? 'active' : ''}`}
                            >
                                <BsBookmarkStarFill className="icon" size={20} />
                                <span className="textNav">MY TRIPS</span>
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="" className='numNavbar'> <FaPhoneAlt /> <span>+91 9876543210</span> </Nav.Link>
                            <NavDropdown
                                className='userDropdown'
                                title={<> <FaCircleUser /> </>}
                                id="basic-nav-dropdown">
                                <NavDropdown.Item href=""> <MdLogin size={20} /> Login</NavDropdown.Item>
                                <NavDropdown.Item href=""> <LuUserPlus size={20} /> Signup</NavDropdown.Item>
                                <NavDropdown.Item href=""> <RiBookmark3Fill size={20} /> Find Booking</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>

        </>
    )
}

export default CustomNavbar 