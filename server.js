require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// cors
const cors = require("cors")
// PORT
const PORT = 3000;
let findOrCreate = require("mongoose-findorcreate");
// data url
const uri = "mongodb://localhost:27017/userDB";
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
// to serve terms and conditions and about page
app.use(express.static("public"));
app.set("view engine", "ejs");
// cors
app.use(cors())
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
// connect to database
mongoose.connect(uri);

const userSchema = new mongoose.Schema({
  firstName: String,
  secondName: String,
  email: String,
  number: String,
  employerStatus: Boolean,
  password: String,
});
const JobSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  email: String,
  time: String,

});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
  res.send("This is home page.");
});

app.post("/", (req, res) => {
  res.send("This is home page with post request.");
});
app.post("/login", (req, res) => {
  const email = req.body.mail;
  const password = req.body.pWord;
  console.log(email, password);
  res.json("Login: " + email)
});

app.post("/signup", (req, res) => {
  const fname = req.body.fname;
  const sname = req.body.sname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  console.log(fname,sname,email,phoneNumber,password);
  res.json("signed up");
  console.log("Signup successful");
});

// terms and conditions
app.get("/terms", (req, res) => {
res.render("terms");
})
// about us page
app.get("/about", (req, res) => {
   res.render("about");
   })

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT} `);
});


