require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

// TODO: Encrypt passwords
// cors
const cors = require("cors");
// PORT
const PORT =process.env.Port || 3000;
//let findOrCreate = require("mongoose-findorcreate");
// data url
const mongo_url=process.env.MONGODB_URL;
const uri = mongo_url.toString();
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
let userEmail = "";
const User = mongoose.model("User", {
  firstName: String,
  secondName: String,
  email: String,
  number: String,
  password: String,
  employer: String,
});
const Job = mongoose.model("Job", {
  user: String,
  title: String,
  description: String,
  email: String,
  time: String,
});

// send email

app.get("/", (req, res) => {
  Job.find({}, (err, result) => {
    if (err) {
      // console.log(err);
    } else {
      if (result) {
        res.send(result);
      }
    }
  });
});
// delete user
app.delete("/", (req, res) => {
  // console.log(userEmail);
  User.deleteOne({ email: userEmail }, (err) => {
    if (err) {
    //  console.log(err);
    } else {
      res.json("deleted successfully");
    }
  });
});

app.post("/", (req, res) => {
  res.send("This is home page with post request.");
});
// job posts
app.get("/posts", (req, res) => {
  res.json("not authenticated");
});
app.post("/login", (req, res) => {
  const email = req.body.mail;
  const password = req.body.pWord;
  User.findOne({ email: email }, (err, result) => {
    if (err) {
    //  console.log("Not found");
    } else {
      if (result) {
        if (result.password === password) {
          userEmail = result.email;
         // console.log("Signed in");
          res.json("Login success");
        } else {
          res.json("User not found");
        }
      }
    }
  });
  // console.log(email, password);
  // res.json("Login: " + email);
});

app.post("/signup", (req, res) => {
//  console.log("signup");
  const fname = req.body.fname;
  const sname = req.body.sname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;

  const newUser = new User({
    firstName: fname,
    secondName: sname,
    email: email,
    number: phoneNumber,
    // create a hashed password
    password: password,
    employer: "False",
  });

  // register user
  User.findOne({ email: email }, (err, result) => {
    if (err) {
    //  console.log(err);
    } else {
      if (result === null) {
      //  console.log(result);
        newUser.save();
        userEmail = newUser.email;
        res.json("Signed successfully");
      } else {
       // console.log(result);
        res.json("Already logged in");
      }
    }
  });
});

app.post("/jobs", (req, res) => {
  const title = req.body.jobTitle;
  const description = req.body.jobDescription;
  const email = req.body.jobEmail;
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var dateTime = date;

//  console.log(dateTime);
//  console.log(title, description, email);
  const newPost = new Job({
    user: userEmail,
    title: title,
    description: description,
    email: email,
    time: dateTime,
  });
  newPost.save();
  res.json("Successful");
});
// forgot password
app.post("/forgot-password", (req, res) => {
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  User.findOne({ email: email }, (err, result) => {
    if (err) {
    //  console.log("Not found");
    } else {
      if (result) {
        if (result.number === phoneNumber) {
          User.updateOne({email: email},{password:password},(err)=>{
            if(err){
           //   console.log(err);
            }else{
            //  console.log("updated successfully")
              res.json("updated password")
            }
          })         
        }
      }
    }
  });
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
