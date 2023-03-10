const io = require("socket.io")();

io.on("connection", (socket) => {
  console.log(socket.id, "a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = io;
