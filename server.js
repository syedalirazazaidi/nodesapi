const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });
connectDB();
const bootcamps = require("./routes/bootcamps");
const app = express();
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5005;

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} node on port ${PORT}`)
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error${err.message}`);
  server.close(() => process.exit(1));
});
