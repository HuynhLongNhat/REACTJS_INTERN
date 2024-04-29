
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../asset/images/logo192.png"
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
const Header = (props) => {
    const { logout, user } = useContext(UserContext)
    const [hideHeader, setHideHeader] = useState(false)
    // useEffect(() => {
    //     if (window.location.pathname === '/login') {
    //         setHideHeader(true)
    //     }
    // }, [])
    const navigation = useNavigate()


    const handleLogout = () => {
        logout()
        navigation('/')
        toast.success("Logout success!")
    }
    return (<>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top mx-1"
                        alt="React Bootstrap logo"
                    />
                    <span>Long Nhat Developer</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* {user && user.auth &&
                        <> */}
                    <Nav className="me-auto"  >
                        <NavLink to="/" className='nav-link'>Home</NavLink>
                        <NavLink to="/users" className='nav-link'>Manage Users </NavLink>
                    </Nav>

                    <Nav>
                        {user && user.email ? <span className='nav-link'>Wellcome {user.email} </span> : ''}
                        <NavDropdown title="Setting">
                            {user && user.auth === true ?
                                <NavDropdown.Item >
                                    <NavLink onClick={() => handleLogout()} className='nav-link'>Logout
                                    </NavLink>
                                </NavDropdown.Item> :
                                <NavDropdown.Item>
                                    <NavLink to="/login" className='nav-link'>Login
                                    </NavLink>
                                </NavDropdown.Item>
                            }


                        </NavDropdown>
                    </Nav>
                    {/* </>} */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>);
}

export default Header;



