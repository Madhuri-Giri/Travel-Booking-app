import React from 'react'
import "./CustomNavbar.css"
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaPhoneAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { LuUserPlus } from "react-icons/lu";
import { RiBookmark3Fill } from "react-icons/ri";
import { GiCommercialAirplane } from "react-icons/gi";
import { TbBus } from "react-icons/tb";
import { RiHotelFill } from "react-icons/ri";

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
                            <Nav.Link className="homnavbbookingicon  homvanlinkss align-items-center">
                                <GiCommercialAirplane className="mx-1" size={20} />
                                FLIGHTS
                            </Nav.Link>
                            <Nav.Link className="homnavbbookingicon homvanlinkss align-items-center ">
                                <TbBus className="mx-2 " size={22} /> BUS
                            </Nav.Link>
                            <Nav.Link className="homnavbbookingicon homvanlinkss align-items-center ">
                                <RiHotelFill className="mx-2 " size={22} /> HOTEL
                            </Nav.Link>
                            <Nav.Link className="homnavbbookingicon homvanlinkss align-items-center ">
                                {/* <RiHotelFill className="mx-2 " size={22} />  */}
                                PACKAGE
                            </Nav.Link>
                            <Nav.Link className="homnavbbookingicon homvanlinkss align-items-center ">
                                {/* <RiHotelFill className="mx-2 " size={22} /> */}
                                 MY TRIPS
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="" className='numNavbar'> <FaPhoneAlt /> <span>+91 9876543210</span> </Nav.Link>
                            <NavDropdown
                                className='userDropdown'
                                title={<> <FaCircleUser /> </>}
                                id="basic-nav-dropdown">
                                <NavDropdown.Item href=""> <MdLogin size={20}/> Login</NavDropdown.Item>
                                <NavDropdown.Item href=""> <LuUserPlus size={20}/> Signup</NavDropdown.Item>
                                <NavDropdown.Item href=""> <RiBookmark3Fill size={20}/> Find Booking</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>

        </>
    )
}

export default CustomNavbar 