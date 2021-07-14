/* abstract */ class UserStore {
  findUsers() {}
  saveUser(userID, user) {}
	findUsersByUser(userID) {}
}

class InMemoryUserStore extends UserStore {
  constructor() {
    super();
    this.users = new Map();
  }

  findUser(id) {
    return this.users.get(id);
  }

  saveUser(id, user) {
    this.users.set(id, user);
  }

  findAllUsers() {
    return [...this.users.values()];
  }
}

module.exports = {
  InMemoryUserStore
};