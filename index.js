const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const sessions = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const productRoutes = require("./routes/products");
const authentication_route = require("./routes/users");
const dashboardRoutes = require("./routes/dashboard");
const salesRoutes = require("./routes/sales");

const User = require("./models/users");
const ExpressError = require("./Utility/AppError");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Sessions
const sessionConfig = {
  secret: "secretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Flash and Session Logic
app.use(sessions(sessionConfig));
app.use(flash());

// Passport Logic (Passport.Session must be after SessionConfig)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// mount product routes under /products
app.use("/", authentication_route);
app.use("/products", productRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/sales", salesRoutes);

app.get("/", (req, res) => {
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
