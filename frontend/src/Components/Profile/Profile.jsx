import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import Header from '../Templates/Header'

function Profile() {
    let { state, dispatch } = useContext(userContext);
    let [username,updateusername]=useState("");
    let [newpassword,updatenewpassword]=useState("");
    let navigate = useNavigate();
    useEffect(() => {
        if (state.user === false) {
            navigate('/');
        }
    }, [state])
    async function updateUsername(event) {
        event.preventDefault();
        if (username!=="") {
            try {
                let response=await fetch('/updateusername',{
                    method:"POST",
                    headers:{
                        "Content-Type":"Application/json"
                    },
                    body:JSON.stringify({
                        username
                    })
                })
                // console.log(response);
                let result=await response.json();
                // console.log(result);
                dispatch({type:"LOGIN",user:true,username:result.username});
                window.alert("username is updated");
            } catch (error) {
                // console.log(error);
            }
        }else{
            window.alert("Please Fill the username");
        }
    }
    async function updatePassword(event) {
        event.preventDefault();
        if (newpassword!=="" ) {
            try {
                let response=await fetch('/updatepassword',{
                    method:"POST",
                    headers:{
                        "Content-Type":"Application/json"
                    },
                    body:JSON.stringify({
                        newpassword
                    })
                })
                // console.log(response);
                let result=await response.json();
                // console.log(result);
                window.alert("password is updated");
            } catch (error) {
                // console.log(error);
            }
        }else{
            window.alert("Please Fill the password with different new password");
        }
    }
    return (
        <>
            <Header />
            <div className="manageContainer">
                <h3>Update Username</h3>
                <div className="update">
                    <form onSubmit={updateUsername} >
                        <input type="text" name="username" value={username} onChange={(event)=>{
                            updateusername(event.target.value)
                        }} id="username" placeholder='Enter Your New Username'/>
                        <button type='submit'>Submit</button>
                    </form>
                </div>
                <h3>Update password</h3>
                <div className="update">
                    <form onSubmit={updatePassword}>
                        <input type="password" name="cpassword" value={newpassword} onChange={(event)=>{
                            updatenewpassword(event.target.value)
                        }} id="cpassword" placeholder='Enter Your new Password' />
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile