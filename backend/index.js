const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
// const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const organizationRoutes = require("./routes/organizationRoutes")
const productRoutes = require("./routes/productRoutes")
const vendorRoutes = require("./routes/vendorRoutes")
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to the database…'))
    .catch((err) => console.error('Connection error:', err));

// app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/org", organizationRoutes);
app.use("/product", productRoutes);
app.use("/vendor", vendorRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`)
})
