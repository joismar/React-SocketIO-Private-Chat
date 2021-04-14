import React, { useState, useEffect } from 'react'
import socket from "../socket"
import MessagePanel from "./MessagePanel"
// import User from "./User"

function Chat(props) {
	const [
		userMessages,
		setUserMessages,
	] = useState([])

	const [
		selectedUser,
		setSelectedUser
	] = useState({
		userId: 'OFFLINE',
		username: null,
	})

	useEffect(() => {
		socket.on("private message", ({ content, from }) => {
			onReceiveMessage(content, from)
    })
	}, [userMessages])

	useEffect(() => {
		socket.on("connect", () => {
			console.log(props.username)
			socket.emit('user is online', props.destUsername)
    })

		socket.on("user online", (userId) => {
			setSelectedUser({
				userId: userId || 'OFFLINE',
				username: props.destUsername,
			})
		})

		return function cleanup() {
      socket.off("connect")
			socket.off("user online")
			socket.off("private message")
			socket.off("disconnect")
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

	function onMessage(content, to) {
		socket.emit("private message", {
			content,
			to,
		})
		setUserMessages([
			...userMessages,
			{
				content,
				fromSelf: true,
			}
		])
	}

	function onReceiveMessage(content, from) {
		console.log(`Messagem: ${content} de ${from}`)
		setUserMessages([
			...userMessages,
			{
				content,
				fromSelf: false,
			}
		])
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
				userMessages={userMessages}
				onMessage={onMessage}
			></MessagePanel>
		</div>
	)
}

export default Chat;