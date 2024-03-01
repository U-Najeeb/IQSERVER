const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const { Server } = require("socket.io");

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

// SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: "https://localhost:5173",
    methods: ["GET", "POST"], // Add other methods as needed
  },
});

io.on("connection", (socket) => {
  console.log(socket.id + " joined");

  socket.on("live-drivers", (driverData) => {
    liveDrivers.set(socket.id, driverData);
    console.log("live driver _____>", liveDrivers);
    io.emit("live-drivers", Array.from(liveDrivers));
  });

  socket.on("SOS", (sosDetails) => {
    console.log(sosDetails);
    io.emit("SOS", sosDetails);
  });

  socket.on("disconnect", () => {
    liveDrivers.delete(socket.id);
    console.log(socket.id, "A user disconnected");
    console.log(liveDrivers, "New Map");
  });
});
