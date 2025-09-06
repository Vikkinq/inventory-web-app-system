const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const productRoutes = require("./routes/products");
const ExpressError = require("./Utility/AppError");
const ejsMate = require("ejs-mate");

const app = express();

// All Static Files like .css and .js will be here
app.use(express.static(path.join(__dirname, "public")));

main().catch((err) => console.log("Error Connection", err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/inventoryApp");
  console.log("DB CONNECTED!");
}

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// mount product routes under /products
app.use("/products", productRoutes);

// redirect home → products
app.get("/products", (req, res) => {
  res.redirect("/products");
});

//----------------
// Error Handlers
//----------------

// No Path Error Handler
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Data Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something Went Wrong!!";
  res.status(statusCode).render("error", { err });
});

app.listen("3000", () => {
  console.log("Server Starting: localhost:3000");
});
