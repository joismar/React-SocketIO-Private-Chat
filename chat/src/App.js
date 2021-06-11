
import React, { useState, useEffect } from 'react'
import Chat from "./components/Chat"
import socket from "./socket"
import { getUsername, getDestUsername } from './helpers'
import './App.css'

function App() {
  
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  function auth(event) {
    event.preventDefault()
    console.log(email, password)
    
    var axios = require('axios');
    var data = JSON.stringify({
      "email": email,
      "senha": password
    });

    var config = {
      method: 'post',
      url: 'http://localhost:4200/api/signin',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(response.headers)
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function usernameChange(event) {
    event.preventDefault()
    setEmail(event.target.value)
  }

  function passwordChange(event) {
    event.preventDefault()
    setPassword(event.target.value)
  }

  return (
    <div className="App">
      {
        authenticated ?
        <Chat></Chat> : 
        <form onSubmit={auth}>  
          <div className="container">   
            <label>Email: </label>   
            <input type="text" placeholder="Enter Username" name="username" onChange={usernameChange} required />  
            <label>Password: </label>   
            <input type="password" placeholder="Enter Password" name="password" onChange={passwordChange} required />  
            <button type="submit">Login</button>   
          </div>   
        </form>
      }
    </div>
  );
}

export default App;
