import React from 'react'
import './Styles/Header.css'
import { NavLink } from 'react-router-dom';
import { userContext } from '../../App';
import { useContext } from 'react';
import { useEffect } from 'react';

function Header() {
    let { state, dispatch } = useContext(userContext);
    function HideNavbar() {
        document.getElementById('mobileNav').style.left = "-100vw"
    }
    function ShowNavbar() {
        document.getElementById('mobileNav').style.left = "0"
    }
    useEffect(() => {

    }, [])
    return (
        <>
            <header className='desktopHeader'>
                <div className="logo">
                    <NavLink to={"/"}>Target ToDo</NavLink>
                </div>
                <nav>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    {
                        state.user === true ? (
                            <>
                                <NavLink to="/manage">Manage Pofile</NavLink>
                                <a>hello {state.username}</a>
                                <NavLink to="/logout">Logout</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login">Login</NavLink>
                            </>
                        )
                    }
                </nav>
            </header>
            <header className="mobileHeader">
                <div className="logo">
                    <i className="fas fa-bars" onClick={() => {
                        ShowNavbar()
                    }}></i>
                    <NavLink to={"/"}>Target ToDo</NavLink>
                </div>
                <nav id='mobileNav'>
                    <i className="fas fa-times" onClick={() => { HideNavbar() }}></i>

                    <NavLink to="/dashboard">Dashboard</NavLink>
                    {
                        state.user === true ? (
                            <>
                                <NavLink to="/manage">Manage Pofile</NavLink>
                                <a>Hello {state.username}</a>
                                <NavLink to="/logout">Logout</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login">Login</NavLink>

                            </>
                        )
                    }
                </nav>
            </header>
        </>
    )
}

export default Header