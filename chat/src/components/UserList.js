import React, { useState, useEffect } from 'react'

function UserList(props) {

	return (
		<div className='userlist'>
			<ul>
				{
					props.userList.map((user) => {
						return (
							<li onClick={props.setDestUsername(user)}>{user}</li>
						)
					})
				}
			</ul>
		</div>
	)
}

export default UserList