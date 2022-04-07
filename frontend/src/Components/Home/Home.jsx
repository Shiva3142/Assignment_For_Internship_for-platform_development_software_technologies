import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import Header from '../Templates/Header'
import './Styles/Home.css'
function Home() {
    let { state, dispatch } = useContext(userContext);

    let navigate = useNavigate()
    useEffect(() => {
        if (state.user === true) {
            navigate('/dashboard');
        }
    }, [])
    return (
        <>
            <Header />
            <div className="homepageContainer">
                <div className="welcomecard">
                    <h1>Welcome To You</h1>
                    <h2>Please Login/Register To Continue</h2>
                </div>
            </div>
        </>
    )
}

export default Home