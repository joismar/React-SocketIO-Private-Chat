function getUsername() {
	return localStorage.getItem("username")
}

function getUserList() {
	return JSON.parse(localStorage.getItem("userList") || "[]")
}

function getDestUsername() {
	return sessionStorage.getItem("destUsername")
}

module.exports = {
	getUsername,
	getDestUsername,
	getUserList,
}