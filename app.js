const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");

//Middleware
app.use(express.json()); //body-parser alt
app.use(morgan("dev"));

//Routes
const typesRoutes = require("./routes/types");
const productsRoutes = require("./routes/products");
const userRoutes = require("./routes/user");

app.use("/types", typesRoutes);
app.use("/products", productsRoutes);
app.use("/user", userRoutes);

//Home route only localhost:3000/ or all the other routes which are not handled by express
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "medstore-database",
  })
  .then(() => {
    console.log("Database Connection is OK");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Server is running http://localhost:3000");
});
