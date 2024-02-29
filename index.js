const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const { Server } = require("socket.io")

const app = require("./app.js");

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => {
  console.log(`DB Connection ✅`);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const liveDrivers = new Map();
// const liveDrivers = new Set();

// SOCKET SERVER 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
})

io.on("connection", (socket) => {
  console.log(socket.id + " joined")

  socket.on("live-drivers", (driverData) => {
    // socket.broadcast.emit("live-drivers", "asdasd")
    // if (!liveDrivers.has(socket.id)) {
    liveDrivers.set(socket.id, driverData)
    // liveDrivers.add(driverData)

    // }
    console.log("live driver _____>", liveDrivers)
    // console.log(driverData)
    io.emit("live-drivers", Array.from(liveDrivers))
    // io.emit("live-drivers", liveDrivers)
  })

  socket.on("SOS", (sosDetails) => {
    console.log(sosDetails)
    io.emit("SOS", sosDetails)
  })

  socket.on("disconnect", () => {
    liveDrivers.delete(socket.id)
    console.log(socket.id, "A user disconnected");
    console.log(liveDrivers, "New Map");
  });
}
)
console.log(liveDrivers)
