const express = require("express");
const path=require('path')
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser=require('cookie-parser')
const bodyParser = require("body-parser");
const fileupload=require('express-fileupload')
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });
connectDB();
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth=require("./routes/auth")
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')))
// app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser())
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(fileupload())
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth); 
app.use(errorHandler);

const PORT = process.env.PORT || 5005;

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} node on port ${PORT}`)
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error${err.message}`);
  server.close(() => process.exit(1));
});
