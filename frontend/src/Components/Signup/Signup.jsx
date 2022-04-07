import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import Header from '../Templates/Header'
import Login from './Login';
import Register from './Register';
import './Styles/Signup.css'

function Signup() {
    let { state ,dispatch} = useContext(userContext);

    let navigate=useNavigate()
    if (state.user===true) {
        navigate('/dashboard');
    }
    let [toggleComponenet,updatetoggleComponenet]=useState(true);
    return (
        <>
        <div className="signUpPage">

            <Header/>
            {
                toggleComponenet?(<Login updateFunction={()=>{
                    updatetoggleComponenet(!toggleComponenet)
                }}/>):(<Register updateFunction={()=>{
                    updatetoggleComponenet(!toggleComponenet)
                }}/>)
            }
            </div>
        </>
    )
}

export default Signup