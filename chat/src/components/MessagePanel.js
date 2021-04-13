import React, { useState, useEffect } from 'react'

function MessagePanel(props) {

	const [inputText, setInputText] = useState('')

	function handleSubmit(event) {
		console.log(inputText)
		props.onMessage(inputText)
		event.preventDefault()
	}

	function handleChange(event) {
		setInputText(event.target.value)
	}

	function displaySender(index) {
		return (
			index === 0 ||
			props.selectedUser.messages[index - 1].fromSelf !==
			props.selectedUser.messages[index].fromSelf
		)
	}

	return (
		<div class="message-panel">
			<ul class="messages">
				{
					props.selectedUser.messages.map((message, index) => {
						return (
							<li class="message">
								{
									displaySender(index) ?
										(
											<div class="sender">
												{ message.fromSelf ? "(yourself)" : props.selectedUser.username }
											</div>
										) : ''
									}
								{ message.content }
							</li>
						)
					})
				}
			</ul>
			<form onSubmit={handleSubmit} value={inputText} class="form">
				<input placeholder="Your message..." class="input" onChange={handleChange}/>
				<button class="send-button" type="submit">Send</button>
			</form>
		</div>
	)
}

export default MessagePanel