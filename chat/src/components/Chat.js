import React, { useState, useEffect } from 'react';
import socket from '../socket';
import ChatBox from './ChatBox';
import UserList from './UserList';
import { getUsername, getDestUsername, getUserList } from '.././helpers'
import MessagePanel from './MessagePanel';
// import User from "./User"

function Chat(props) {
  const [username, setUsername] = useState(null)

  const [destUsername, setDestUsername] = useState(null)

  const [userList, setUserList] = useState([])

  useEffect(() => {
    setUsername(props.username)
    setDestUsername(getDestUsername())

    console.log(username, destUsername)
  }, [username])

  useEffect(() => {
    setUserList(getUserList())
  }, userList)

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    const username = getUsername()

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else if (username) {
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
        setUsername(null)
        setDestUsername(null)
      }
    })

    return function cleanup() {
      socket.off("session")
      socket.off("connect_error")
    }
  }, [])

  function disconnect() {
    socket.emit('disconnect')
  }

  return (
    <div className="App">
      {
        (!username && !destUsername) ?
        <p>Loading...</p> :
        <>
          <UserList
            setDestUsername={setDestUsername}
            userList={userList || []}
          ></UserList>
          <ChatBox
            username={username}
            destUsername={destUsername}
          ></ChatBox>
        </>
      }
    </div>
  )
}

export default Chat;