const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  console.log(`${username} logou!`)
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  var users = {};
  
  for (let [id, socket] of io.of("/").sockets) {
    users[socket.username] = id
  }
  // socket.emit("users", users);

  // notify existing users
  // socket.broadcast.emit("user connected", {
  //   userID: socket.id,
  //   username: socket.username,
  // });

  // check if user is online
  socket.on('user is online', (username) => {
    console.log(users)
    for (let [id, socket] of io.of("/").sockets) {
      users[socket.username] = id
    }
    socket.emit("user online", users[username] || null)
  })
             
  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    console.log(`Messagem: ${content} para ${to}`)
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    console.log(`${socket.username} deslogou!`)
    socket.to(null).emit('dest disconnected', socket.username)
  });

  socket.on("dest disconnected", (destUser) => {
		console.log(`${socket.username} recebeu a remoção de ${destUser}`)
  })
});

const PORT = process.env.PORT || 3003;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
