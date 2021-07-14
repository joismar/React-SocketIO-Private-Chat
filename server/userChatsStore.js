/* abstract */ class UserChatsStore {
  saveChat(userID, chat) {}
	findChatsByUser(userID) {}
}

class InMemoryUserChatsStore extends UserChatsStore {
  constructor() {
    super();
    this.chats = new Map();
  }

  saveChat(id, chat) {
    this.chats.set(id, chat);
  }

  saveMessage(userID, message) {
    const chat = this.chats.get(userID);
    if (chat) {
      chat.messages.push(message);
    }
    return [];
  }

  findMessagesByUser(userID) {
    const chat = this.chats.get(userID);
    if (chat) {
      return chat.messages;
    }
    return [];
  }

  findChatsByUser(id) {
    return this.chats.get(id);
  }
}

module.exports = {
  InMemoryUserChatsStore
};
