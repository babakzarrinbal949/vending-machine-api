import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import {FaUser, FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';

function AppNavbar() {
    const token = localStorage.getItem('access-token');

    return (
        <Navbar className="px-4" bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">Vending Machine App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                {token &&
                    (<Nav className="mr-auto">
                        <Nav.Link as={Link} to="/deposit">Deposit</Nav.Link>
                    </Nav>)
                }

                <Nav>
                    <Nav.Link as={Link} to={token ? "/logout" : "/login"}>
                        {token ? <FaSignOutAlt title='Logout' /> : <FaSignInAlt />}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;
