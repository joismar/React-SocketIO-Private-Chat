
import React, { useState, useEffect } from 'react'
import SelectUsername from "./components/SelectUsername"
import Chat from "./components/Chat"
import socket from "./socket"
import './App.css'

function App() {
  const [
    username, 
    setUsername 
  ] = useState(getUsername())

  const [
    destUsername,
    setDestUsername
  ] = useState(getDestUsername())

  function onUsernameSelection(username) {
    setUsername(username)
    socket.auth = { username }
    socket.connect()
  }

  function getUsername() {
    return localStorage.getItem("username") || 'Chupeta'
  }

  function getDestUsername() {
    return sessionStorage.getItem("destUsername") || 'Jenny'
  }

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      setUsername(username);
      socket.auth = { sessionID };
      socket.connect();
    } else {
      socket.auth = { username }
      socket.connect()
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsername(false)
      }
    })

    return function cleanup() {
      socket.off("connect_error")
    }
  }, [])

  return (
    <div className="App">
      {
        !username ?
        <SelectUsername 
          onUsernameSelection={onUsernameSelection}
          setDestUsername={setDestUsername}
          destUsername={destUsername}
        ></SelectUsername> :
        <Chat 
          username={username}
          destUsername={destUsername}
        ></Chat>
      }
    </div>
  );
}

export default App
