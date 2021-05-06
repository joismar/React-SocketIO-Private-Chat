import React, { useState, useEffect } from 'react'

function MessagePanel(props) {

	const [inputText, setInputText] = useState('')

	function handleSubmit(event) {
		props.onMessage(inputText, props.destUserData.userId)
		setInputText('')
		event.preventDefault()
	}

	function handleChange(event) {
		setInputText(event.target.value)
	}

	function displaySender(index) {
		return (
			index === 0 ||
			props.userMessages[index - 1].fromSelf !==
			props.userMessages[index].fromSelf
		)
	}

	return (
		<div class="message-panel">
			<ul class="messages">
				{
					props.userMessages.map((message, index) => {
						return (
							<li class="message">
								{
									displaySender(index) ?
										(
											<div class="sender">
												<b>{ message.fromSelf ? '(Tu)' : props.destUsername }</b>
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
				<input placeholder="Your message..." class="input" onChange={handleChange} value={inputText}/>
				<button class="send-button" type="submit">Send</button>
			</form>
		</div>
	)
}

export default MessagePanel