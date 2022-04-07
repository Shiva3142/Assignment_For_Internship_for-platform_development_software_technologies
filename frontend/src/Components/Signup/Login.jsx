import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { userContext } from '../../App';

function Login({ updateFunction }) {
    let { state ,dispatch} = useContext(userContext);
    let [logindata, updatelogindata] = useState({
        email: "",
        password: ""
    })
    function handlelogindata(event) {
        updatelogindata((prevalue) => {
            return ({
                ...prevalue,
                [event.target.name]: event.target.value
            })
        })
    }
    async function Login(event) {
        event.preventDefault();
        // console.log(logindata);
        if (logindata.email !== "" && logindata.password !== "") {
            try {
                let response = await fetch('/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body:JSON.stringify(logindata)
                })
                // console.log(response);
                // window.alert(response.status);
                if (response.status === 200) {
                    let result = await response.json();
                    // console.log(result);
                    window.alert("SuccessFully Login");
                    dispatch({type:"LOGIN",user:true,username:result.username})
                }
                else if (response.status === 401) {
                    window.alert("Invalid Credentials");
                }
                else {
                    window.alert("Some Error Occured");
                }
            } catch (error) {
                // console.log(error);
            }
        } else {
            window.alert("Please Fill All the Values");
        }
    }
    return (
        <>
            <div className="signUpcontainer">
                <div className="left">
                </div>
                <form onSubmit={Login} className="signUpForm">
                    <h1>LOGIN HERE</h1>
                    <input type="text" onChange={handlelogindata} value={logindata.email} name="email" id="email" placeholder='Enter Your Email/Username' />
                    <input type="password" onChange={handlelogindata} value={logindata.password} name="password" id="password" placeholder='Enter Your Password' />
                    <input type="submit" value="Login" />
                    <p>New User? <a href onClick={() => {
                        updateFunction();
                    }}>Register Here</a></p>
                </form>
            </div>
        </>
    )
}

export default Login