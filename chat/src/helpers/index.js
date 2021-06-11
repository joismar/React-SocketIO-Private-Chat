function getUsername() {
	return sessionStorage.getItem("username")
}

function getDestUsername() {
	return sessionStorage.getItem("destUsername")
}

module.exports = {
	getUsername,
	getDestUsername
}