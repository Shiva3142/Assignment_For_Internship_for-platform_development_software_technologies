import './App.css';
import Home from './Components/Home/Home'
import { Routes, Route } from "react-router-dom";
import Profile from './Components/Profile/Profile';
import Dashboard from './Components/Dashboard/Dashboard';
import Signup from './Components/Signup/Signup';
import { createContext } from 'react';
import { useReducer } from 'react';
import Logout from './Components/Templates/Logout';
import { useEffect } from 'react';
let userContext = createContext()

let initialState = {
	user: true,
	username: null,
}
function reducer(state, action) {
	if (action.type === "LOGIN") {
		return ({
			user: action.user,
			username: action.username,
		})
	}
	else if (action.type === "LOGOUT") {
		return ({
			user: action.user,
			username: action.username,
		})
	}
	return state;
}

function App() {
	let [state, dispatch] = useReducer(reducer, initialState)
	async function CheckUser() {
        try {
            let response = await fetch('/authunicateuser', {
                method: "POST"
            })
            let res = await response.json()
            // console.log(response);
            // console.log(res);
            if (response.status === 200) {
                dispatch({ type: "LOGIN", user: true, username: res.username, cartcount: res.cartcount })
            }
            else{
                dispatch({ type: "LOGOUT", user: false, username: null })
            }
        } catch (error) {
            console.log(error);
        }
    }
	useEffect(()=>{
		CheckUser();
	},[])
	return (
		<>
			<userContext.Provider value={{ state, dispatch }}>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/login" element={<Signup />} />
					<Route exact path="/dashboard" element={<Dashboard />} />
					<Route exact path="/manage" element={<Profile />} />
					<Route exact path="/logout" element={<Logout />} />
				</Routes>
			</userContext.Provider>
		</>
	);
}

export default App;
export { userContext}