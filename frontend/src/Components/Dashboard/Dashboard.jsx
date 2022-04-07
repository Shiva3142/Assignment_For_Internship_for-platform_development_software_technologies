import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import Header from '../Templates/Header'
import './Styles/Dashboard.css'
function Dashboard() {
    let { state, dispatch } = useContext(userContext);
    let navigate = useNavigate()
    useEffect(() => {
        if (state.user === false) {
            navigate('/');
        }
    }, [state])
    let [todo, updatetodo] = useState("");
    let [todoItems, updatetodoItems] = useState(null);
    async function getToDOItems() {
        try {
            let response = await fetch('/gettodoitems', {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                }
            })
            // console.log(response);
            let result = await response.json();
            // console.log(result);
            updatetodoItems(result)
        } catch (error) {
            // console.log(error);
        }
    }
    useEffect(() => {
        getToDOItems()
    }, [])
    async function submitToDo(event) {
        event.preventDefault();
        if (todo !== "") {
            try {
                let response = await fetch('/addtodoitem', {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify({
                        todo
                    })
                })
                // console.log(response);
                let result = await response.json();
                // console.log(result);
            updatetodoItems(result)
            updatetodo("")
                // getToDOItems()
            } catch (error) {
                // console.log(error);
            }
        }
    }
    async function deleteTODO(value) {
        // console.log(value);
        try {
            let response = await fetch('/deletetodoItem', {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({
                    id:value._id
                })
            })
            // console.log(response);
            let result = await response.json();
            // console.log(result);
            updatetodoItems(result)
            // getToDOItems()
        } catch (error) {
            // console.log(error);
        }
    }
    async function EditToDO(value) {
        console.log(value);
        updatetodo(value.content)
        deleteTODO(value)
    }
    return (
        <>
            <Header />
            <div className="todoFormContainer">
                <form onSubmit={submitToDo}>
                    <input type="text" name="task" value={todo} onChange={(event) => {
                        updatetodo(event.target.value)
                    }} id="task" placeholder='Enter Your TODO items' />
                    <button type='submit'>Submit</button>
                </form>
                <div className="todoItems">
                    {
                        (todoItems !== null && todoItems.length > 0) ? (
                            <>
                            {
                                todoItems.map((value,index)=>{
                                    return(
                                        

                                        <div key={index} className="todoItem">
                                            <h1>
                                                {
                                                    value.content
                                                }
                                            </h1>
                                            <p>
                                                {
                                                    value.createdAt
                                                }
                                            </p>
                                            <div className="todobuuttonContainer">
                                                <button onClick={()=>{EditToDO(value)}}>
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onClick={()=>{deleteTODO(value)}}>
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>

                                        
                                    )
                                })
                            }

                            </>
                        ) : (
                            <>
                            <h1>TO DO LIST IS EMPTY</h1>
                            
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Dashboard