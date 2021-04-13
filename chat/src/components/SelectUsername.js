import React, { useState, useEffect } from 'react'

function SelectUsername(props) {
	const [ username, setUsername ] = useState('Chupeta')

	function handleSubmit(event) {
		props.onUsernameSelection(username)
		event.preventDefault()
	}
	
	function handleChange(event) {
		setUsername(event.target.value)
	}

	function handleDestChange(event) {
		props.setDestUsername(event.target.value)
	}

	return (
		<div class="select-username">
			<form onSubmit={handleSubmit}>
				<input 
					placeholder="Usuario" 
					value={username} 
					onChange={handleChange}
					// type='hidden'
				/>
				<input 
					placeholder="Destinatário" 
					value={props.destUsername} 
					onChange={handleDestChange}
					// type='hidden'
				/>
				<button>Iniciar Chat</button>
			</form>
		</div>
	)
}

export default SelectUsername