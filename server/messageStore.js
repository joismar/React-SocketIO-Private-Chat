/* abstract */ class messageStore {
  saveMessage(userID, chat) {}
	findChatsByUser(userID) {}
}

class InMemoryMessageStore extends messageStore {
  constructor() {
    super();
    this.messages = new Map();
  }

  saveChat(id, chat) {
    this.messages.push({id, chat});
  }

  findMessagesByUser(id) {
    return this.messages.get(id);
  }
}

module.exports = {
  InMemoryMessageStore
};