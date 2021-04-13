import React, { useState, useEffect } from 'react'
import socket from "../socket"
import MessagePanel from "./MessagePanel"
// import User from "./User"

function Chat(props) {
	const [
		selectedUser,
		setSelectedUser
	] = useState({
		userId: 'OFFLINE',
		username: null,
	})

	useEffect(() => {
		socket.on("connect", () => {
			socket.emit('user is online', props.destUsername)
    })

		socket.on("user online", (userId) => {
			setSelectedUser({
				userId: userId,
				username: props.destUsername,
			})
		})

		return function cleanup() {
      socket.off("connect")
			socket.off("user online")
    }
	}, [props.destUsername])

	useEffect(() => {
		const timer = setInterval(() => {
      socket.emit('user is online', props.destUsername)
    }, 5000);

		return function cleanup() {
      clearInterval(timer)
    }
	}, [props.destUsername])

	function onMessage(content) {
		socket.emit("private message", {
			content,
			to: selectedUser.userID,
		})
		selectedUser.messages.push({
			content,
			fromSelf: true,
		})
		setSelectedUser({
			userId: selectedUser.userId,
			username: props.destUsername,
		})
	}

	return (
		<div>
			<p>
				UserId: {selectedUser.userId || 'OFFLINE'}    
				Username: {selectedUser.username}
			</p>
			<MessagePanel
				username={props.username}
				selectedUser={selectedUser}
				onMessage={onMessage}
			></MessagePanel>
		</div>
	)
}

export default Chat;