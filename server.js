require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// cors
const cors = require("cors");
// PORT
const PORT = 3000;
//let findOrCreate = require("mongoose-findorcreate");
// data url
const uri = "mongodb://localhost:27017/petesListDB";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// to serve terms and conditions and about page
app.use(express.static("public"));
app.set("view engine", "ejs");
// cors
app.use(cors());
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// passport configuration
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

// initialize passport
// app.use(passport.initialize());
// // use passport to setup a session
// app.use(passport.session());
// connect to database
mongoose.connect(uri);

const User = mongoose.model("User", {
  firstName: String,
  secondName: String,
  email: String,
  number: String,
  password: String,
  employer: String
});
const JobSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  email: String,
  time: String,
});
// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
//const User = new mongoose.model("User", userSchema);
// passport.use(User.createStrategy());
// // create cookie
// passport.serializeUser(User.serializeUser());
// // let passport open the cookie and read data
// passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.send("This is home page.");
});

app.post("/", (req, res) => {
  res.send("This is home page with post request.");
});
// job posts
app.get("/posts", (req, res) => {
  res.json("not authenticated")
});
app.post("/login", (req, res) => {
  const email = req.body.mail;
  const password = req.body.pWord;
  console.log(email, password);
  res.json("Login: " + email);
});

app.post("/signup", (req, res) => {
  const fname = req.body.fname;
  const sname = req.body.sname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  // register user

  const newUser = new User({
    firstName: fname,
    secondName: sname,
    email: email,
    number: phoneNumber,
    // create a hashed password
    password: password,
    employer:"False"
  });

  newUser.save().then(()=>res.json("successful signup"));

  // User.register(
  //   { username: email },
  //   password,
  //   //  fname,
  //   // sname,
  //   // phoneNumber,
  //   (err, user) => {
  //     if (err) {
  //       console.log(err);
  //       res.json("not authenticated");
  //     } else {
  //       passport.authenticate("local")(req, res, () => {
  //         res.json("authenticated");
  //       });
  //     }
  //   }
  // );
  //console.log(fname,sname,email,phoneNumber,password);
  console.log("Signup successful");
});

// terms and conditions
app.get("/terms", (req, res) => {
  res.render("terms");
});
// about us page
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT} `);
});
