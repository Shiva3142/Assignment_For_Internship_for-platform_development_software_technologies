import React, {useContext, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { userContext } from '../../App'

function Logout() {
    let { state,dispatch } = useContext(userContext)
    let navigate=useNavigate()
    // console.log(state);
    useEffect(()=>{
        if (state.user===false) {
            navigate(-1)
        }
    })
    let logout=async()=>{
        await fetch('/logout',{
            method:"POST"
        })
        dispatch({type:"LOGOUT",user:false,username:null})
        navigate("/");
    }
    useEffect(()=>{
        logout()
    },[])
    return(
        <>
        </>
    )
}

export default Logout
