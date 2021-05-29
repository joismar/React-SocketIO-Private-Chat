
import React, { useState, useEffect } from 'react'
import SelectUsername from "./components/SelectUsername"
import Chat from "./components/Chat"
import socket from "./socket"
import './App.css'

function App() {
  const [
    username, 
    setUsername 
  ] = useState(null)

  const [
    destUsername,
    setDestUsername
  ] = useState(null)

  // function onUsernameSelection(username) {
  //   setUsername(username)
  //   socket.auth = { username }
  //   socket.connect()
  // }

  function getUsername() {
    return sessionStorage.getItem("username")
  }

  function getDestUsername() {
    return sessionStorage.getItem("destUsername")
  }

  useEffect(() => {
    setUsername(getUsername())
    setDestUsername(getDestUsername())

    console.log(username, destUsername)
  }, [username, destUsername])

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    const username = getUsername()

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else {
      if (username) {
        socket.auth = { username }
        socket.connect()
      }
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
        setUsername(null)
        setDestUsername(null)
      }
    })

    return function cleanup() {
      socket.off("session")
      socket.off("connect_error")
    }
  }, [])

  return (
    <div className="App">
      {
        (!username && !destUsername) ?
        // <SelectUsername 
        //   onUsernameSelection={onUsernameSelection}
        //   setDestUsername={setDestUsername}
        //   destUsername={destUsername}
        // ></SelectUsername> 
        <p>Loading...</p>:
        <Chat 
          username={username}
          destUsername={destUsername}
        ></Chat>
      }
    </div>
  );
}

export default App
