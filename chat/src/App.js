
import React, { useState, useEffect } from 'react'
import Chat from "./components/Chat"
import socket from "./socket"
import { getUsername, getDestUsername } from './helpers'
import './App.css'

function App() {
  
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) {
      setToken(sessionStorage.getItem('auth-token'))
      setUsername(sessionStorage.getItem('username'))
      setAuthenticated(true)
    }
  }, [])

  function auth(event) {
    event.preventDefault()
      
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
      data: data
    };

    axios(config).then(function (response) {
      if (response.headers['auth-token']) {
        setToken(response.headers['auth-token'])
        setUsername(response.data.usuario)
        setAuthenticated(true)

        sessionStorage.setItem('username', response.data.usuario)
        sessionStorage.setItem('auth-token', response.headers['auth-token'])
      } else {
        console.log('Usuario/senha inválidos!')
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function logout() {
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('auth-token')
    sessionStorage.removeItem('sessionID')

    document.location.reload()
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
        <>
          <button onClick={logout}>SAI MIZERA</button>
          <Chat
            username={username}
            token={token}
            // logoutCallback={}
          ></Chat>
        </> : 
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
