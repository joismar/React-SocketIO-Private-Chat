import React, { useState, useEffect } from 'react'

function UserList(props) {

	function setUser(user) {
		props.setDestUsername(user);
	}

	return (
		<div className='userlist'>
			<ul>
				{
					props.userList.map((user) => {
						return (
							<button onClick={setUser(user)}>{user}</button>
						)
					})
				}
			</ul>
		</div>
	)
}

export default UserList