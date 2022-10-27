require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// cors
const cors = require("cors")
// google auth
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// PORT
const PORT = 3000;
let findOrCreate = require("mongoose-findorcreate");
// data url
const uri = "mongodb://localhost:27017/userDB";
const app = express();
// to serve terms and conditions and about page
app.use(express.static("public"));
app.set("view engine", "ejs");
// cors
app.use(cors())
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(uri);

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  employerStatus: Boolean,
  password: String,
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/peteslist",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", (req, res) => {
  res.send("This is home page.");
});

app.post("/", (req, res) => {
  res.send("This is home page with post request.");
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

// todo:Add terms and conditions website to this server
//todo:add declaration website to this server
