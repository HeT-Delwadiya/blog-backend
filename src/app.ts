require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Import Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const draftRoutes = require("./routes/draft");
const adminRoutes = require("./routes/admin");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Set Routes
app.use(`${process.env.URL_PREFIX}/api`, authRoutes);
app.use(`${process.env.URL_PREFIX}/api`, postRoutes);
app.use(`${process.env.URL_PREFIX}/api`, userRoutes);
app.use(`${process.env.URL_PREFIX}/api`, draftRoutes);
app.use(`${process.env.URL_PREFIX}/api`, adminRoutes);

//DB connection
mongoose.connect(process.env.DB_URL)
.then(() => console.log(`⚡️[database]: Mongo connected successfully\n===========================================`));

//server starter
const server = app.listen(process.env.PORT || 8000, () => console.log(`===========================================\n ⚡️[server]: Server started on port: ${process.env.PORT}`));
module.exports = server