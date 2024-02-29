import React from 'react';
import Logo from './BO-Logo.svg';
import './Navbar.css';
import { Link } from "react-router-dom";
import Button from '../Button/Button.js';

const Navbar = () => {
    return (
        <>
            <img src={Logo} alt="BO-Logo" id="Logo" />
            <nav className="Navbar">
                <ul className="Links">
                    <li className="Link">
                        <Link className="CustomLink" to="/">Videos</Link>
                    </li>

                    <li className="Link">
                        <Link className="CustomLink" to="/edit">Hochladen/Bearbeiten</Link>
                    </li>
                    <div className="DarkMode-Div">
                        <Button id="DarkMode-Button" text="Darkmode"></Button>
                    </div>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;