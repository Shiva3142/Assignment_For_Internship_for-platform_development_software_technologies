import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { userContext } from '../../App';
function Register({ updateFunction }) {
    let { state ,dispatch} = useContext(userContext);
    let [registerdata, updateregisterdata] = useState({
        name: "",
        email: "",
        username: "",
        password: ""
    })

    function handleregisterdata(event) {
        updateregisterdata((prevalue) => {
            return ({
                ...prevalue,
                [event.target.name]: event.target.value
            })
        })
    }
    async function Register(event) {
        event.preventDefault();
        if (registerdata.name !== "" && registerdata.email !== "" && registerdata.username !== "" && registerdata.password !== "") {
            try {
                let response = await fetch('/register', {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify(registerdata)
                })
                // console.log(response);
                window.alert(response.status);
                if (response.status === 200) {
                    let result = await response.json();
                    // console.log(result);
                    window.alert("SuccessFully Registered");
                    dispatch({type:"LOGIN",user:true,username:result.username})
                }
                else if (response.status === 400) {
                    window.alert("User Already Exits with this email");
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
                <form onSubmit={Register} className="signUpForm">
                    <h1>REGISTER HERE</h1>
                    <input type="text" onChange={handleregisterdata} value={registerdata.name} name="name" id="name" placeholder='Enter Your Name' />
                    <input type="text" onChange={handleregisterdata} value={registerdata.username} name="username" id="username" placeholder='Enter Your Username' />
                    <input type="text" onChange={handleregisterdata} value={registerdata.email} name="email" id="email" placeholder='Enter Your Email/Username' />
                    <input type="password" onChange={handleregisterdata} value={registerdata.password} name="password" id="password" placeholder='Enter Your Password' />
                    <input type="submit" value="Login" />
                    <p>Already Registered? <a href onClick={() => {
                        updateFunction();
                    }}>Login Here</a></p>
                </form>
            </div>
        </>
    )
}

export default Register