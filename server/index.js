const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemorySessionStore } = require("./sessionStore");
const { InMemoryUserStore } = require("./userStore");
const { InMemoryUserChatsStore } = require("./userChatsStore");

const sessionStore = new InMemorySessionStore();
const userStore = new InMemoryUserStore();
const userChatsStore = new InMemoryUserChatsStore();

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;

  /**
   * Verificar se USERNAME já está na base, se não tiver cria um novo
   * com USERNAME, TOKEN, *LOGGED*, EXPIRE, caso tenha, verifica o
   * EXPIRE e caso esteja expirado retorna erro. Caso contrário
   * mantem a sessão ativa e renova o EXPIRE.
   */

  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }

  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }
  
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  console.log("Connected!")
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  var users = {};
  
  sessionStore.findAllSessions().forEach((session) => {
    users[session.username] = {
      userID: session.userID,
      connected: session.connected,
    }
  })

  // check if user is online
  socket.on('user is online', (username) => {
    console.log(users)
    
    sessionStore.findAllSessions().forEach((session) => {
      users[session.username] = {
        userID: session.userID,
        connected: session.connected,
      }
    })

    socket.emit("user online", users[username] || null)
  })

  // retrieve user messages
  socket.on('user messages', (username) => {
    messages = userChatsStore.findMessagesByUser(username)
    socket.emit("user messages", messages)
  })
             
  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    console.log(`Messagem: ${content} para ${to}`)

    socket.to(to).emit("private message", {
      content,
      from: socket.userID,
      to,
    });
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      // socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });
});

const PORT = process.env.PORT || 3003;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
