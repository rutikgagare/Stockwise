const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const orderRoutes = require("./routes/orderRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/Images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//   }
// })

// const upload = multer({
//   storage: storage
// })

// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     res.json({ fileneme: req.file.filename });
//   } catch (err) {
//     res.json(err);
//   }
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to the database…"))
  .catch((err) => console.error("Connection error:", err));

// app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/org", organizationRoutes);
app.use("/category", categoryRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/vendor", vendorRoutes);
app.use("/order", orderRoutes);
app.use("/assign", assignmentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
