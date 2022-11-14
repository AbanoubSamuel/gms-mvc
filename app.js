const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
// const app = express.Router()
const port = 8000;
const socketPort = 4000;
const mongo = require("./config/mongoose");
const User = require("./models/User");
const cors = require("cors");
const Job = require("./models/Order");
const res = require("express/lib/response");
const userRouter = require("./routes/userRoute");
const exerciseRouter = require("./routes/exerciseRoute");
const productsRouter = require("./routes/productRoute");
const healthyFoodRouter = require("./routes/Health-System");
const notificationRouter = require("./routes/notificationRoute");
const orderRouter = require("./routes/orderRoute");
const engines = require("consolidate");

app.use(function (req, res, next)
{
  res.set({
    "Access-Control-Expose-Headers": "*",
  });
  next();
});
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
//Socket Structure

let adminNotificationArray = [];
let clientNotificationArray = [];
let onlineUsers = [];

const addNewUser = (email, socketId) =>
{
  !onlineUsers.some((user) => user.email === email) &&
    onlineUsers.push({ email, socketId });
};
const removeUser = (socketId) =>
{
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (email) =>
{
  return onlineUsers.find((user) => user.email === email);
};
function adminNotfyMsg(msg, email)
{
  adminNotificationArray.push(`${msg} ${email} ${new Date().toLocaleString()}`);
}
function clientNotfyMsg(msg, email)
{
  clientNotificationArray.push(
    `${msg} ${email} ${new Date().toLocaleString()}`
  );
}
// Init The Socket
io.on("connection", function (socket)
{
  // console.log("A user connected");
  // console.log("socket.id");

  // console.log(adminNotificationArray);

  // Client Sockets

  // Order Socket
  socket.on("Order", (email) =>
  {
    console.log("first");
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    adminNotfyMsg("New Order from", email);
    console.log(adminNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    io.to(sender.socketId).emit("orderResponse", "Order Placed");
    io.emit("Admin Notifications", adminNotificationArray);
    console.log(adminNotificationArray);
  });

  // Trainer Sockets

  // Add Exercise
  socket.on("addExercise", (email) =>
  {
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    adminNotfyMsg("New Exercise added from", email);
    console.log(adminNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    // io.to(sender.socketId).emit(
    //   "addExerciseResponse",
    //   "Exercise added successfully"
    // );
    io.emit("Admin Notifications", adminNotificationArray);
    console.log(adminNotificationArray);
  });

  // Update Exercise
  socket.on("updateExercise", (email) =>
  {
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    adminNotfyMsg("Exercise updated from", email);
    console.log(adminNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    // io.to(sender.socketId).emit(
    //   "updateExerciseResponse",
    //   "Exercise updated successfully"
    // );
    io.emit("Admin Notifications", adminNotificationArray);
    console.log(adminNotificationArray);
  });

  // delete Exercise
  socket.on("deleteExercise", (email) =>
  {
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    adminNotfyMsg("Exercise deleted from", email);
    console.log(adminNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    // io.to(sender.socketId).emit(
    //   "deleteExerciseResponse",
    //   "Exercise deleted successfully"
    // );
    io.emit("Admin Notifications", adminNotificationArray);
    // console.log(adminNotificationArray);
  });

  // Assign Exercise
  socket.on("assignExercise", (email) =>
  {
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    clientNotfyMsg("New assigned Exercises from", email);
    console.log(clientNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    io.to(sender.socketId).emit(
      "assignExerciseResponse",
      "Exercise assigned successfully"
    );
  });

  // Add Food
  socket.on("addFood", (email) =>
  {
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    adminNotfyMsg("New Food added from", email);
    console.log(adminNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    // io.to(sender.socketId).emit(
    //   "addFoodResponse",
    //   "New Healthy-Food added successfully"
    // );
    io.emit("Admin Notifications", adminNotificationArray);
    console.log(adminNotificationArray);
  });

  // Update Food
  socket.on("updateFood", (email) =>
  {
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    adminNotfyMsg("Food updated from", email);
    console.log(adminNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    // io.to(sender.socketId).emit(
    //   "updateFoodResponse",
    //   "Healthy-Food updated successfully"
    // );
    io.emit("Admin Notifications", adminNotificationArray);
    console.log(adminNotificationArray);
  });

  // delete Food
  socket.on("deleteFood", (email) =>
  {
    console.log(email);
    console.log(socket.id);
    addNewUser(email, socket.id);
    adminNotfyMsg("Food deleted from", email);
    console.log(adminNotificationArray);
    const sender = getUser(email);
    console.log(sender);
    // io.to(sender.socketId).emit(
    //   "deleteFoodResponse",
    //   "Healthy-Food deleted successfully"
    // );
    io.emit("Admin Notifications", adminNotificationArray);
    console.log(adminNotificationArray);
  });

  // Assign Healty-Food

  // Admin Socket
  socket.emit("Admin Notifications", adminNotificationArray);
  socket.on("Clear Notifications", (msg) =>
  {
    adminNotificationArray = [];
    console.log(adminNotificationArray);
  });

  // Remove User
  socket.on("disconnect", () =>
  {
    removeUser(socket.id);
  });
});
// app.use(bcrypt)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/exercises", exerciseRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/healthyfoods", healthyFoodRouter);
app.use("/api/v1/Orders", orderRouter);
app.use("/api/v1/notification", notificationRouter);
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/public", express.static("public"));
app.use("/public/exercises", express.static("public/exercises"));
app.use("/public/HealthyFood", express.static("public/HealthyFood"));
app.use("/public/profile", express.static("public/profile"));
app.engine("ejs", engines.ejs);
app.set("views", "./Views");
app.set("view engine", "ejs");
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
http.listen(socketPort, () =>
  console.log(`Example Socket listening on port ${socketPort}!`)
);
