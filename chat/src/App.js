
import React, { useState, useEffect } from 'react'
import SelectUsername from "./components/SelectUsername"
import Chat from "./components/Chat"
import socket from "./socket"
import './App.css'

function App() {
  const [
    usernameSelected, 
    setUsernameSelected 
  ] = useState(false)

  const [
    destUsername,
    setDestUsername
  ] = useState('Jennynha')

  function onUsernameSelection(username) {
    setUsernameSelected(username)
    socket.auth = { username }
    socket.connect()
  }

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameSelected(false)
      }
    })

    return function cleanup() {
      socket.off("connect_error")
    }
  }, [])

  return (
    <div className="App">
      {
        !usernameSelected ?
        <SelectUsername 
          onUsernameSelection={onUsernameSelection}
          setDestUsername={setDestUsername}
          destUsername={destUsername}
        ></SelectUsername> :
        <Chat 
          username={usernameSelected}
          destUsername={destUsername}
        ></Chat>
      }
    </div>
  );
}

export default App
