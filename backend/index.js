const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// const socketio = require("socket.io");
// const http = require("http");

const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const orderRoutes = require("./routes/orderRoutes");
const serviceRoutes = require("./routes/serviceRoutes.js");
const ticketRoutes = require("./routes/ticketRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

require("dotenv").config();

const app = express();

// const server = http.createServer(app);
// const io = socketio(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to the database…"))
  .catch((err) => console.error("Connection error:", err));

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/org", organizationRoutes);
app.use("/category", categoryRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/vendor", vendorRoutes);
app.use("/order", orderRoutes);
app.use("/ticket", ticketRoutes);
app.use("/service", serviceRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
