require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
require("./db/conn");
const auth= require("./middleware/auth")
const Register = require("./model/registration");

const app = express();
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json()); //for postman it gives the output
app.use(express.urlencoded({ extended: false })); // ab jab form say koi data get kar rahay to yay use karo
app.use(cookieParser())
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.static(static_path));

app.get("", (req, res) => {
  res.render("index");
});
app.get("/secret", auth, (req, res) => {
  // console.log((`This is cookie awesome ${req.cookies.jwt}`));
  res.render("secret");
});
app.get("/logout", auth, async(req, res) => {
try {
  console.log(req.user);
  //for single logout
  //filter main saray token ki value ajayega
  // req.user.tokens = req.user.tokens.filter((currelement)=>{
  //  return currelement.token !== req.cookieContent
  // })
  //logout from all devices
  req.user.tokens=[];
  //go to auth page and get their
  res.clearCookie("jwt");
  console.log("logout successfully");
  //req.user to yaha save horaha hai
  await req.user.save();
  res.render("login")
} catch (error) {
  res.status(500).send(error)
}
});
app.get("/registration", (req, res) => {
  res.render("registration");
});
app.get("/login", (req, res) => {
  res.render("login");
});
//create new employeee
app.post("/registration", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.tel,
        age: req.body.age,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      //concept of middleware do cheezao kay beach kaam horaha
      //hash password
      //generate token
      //function ka name kuch bhi daysakhtay ho
      const token = await registerEmployee.generateAuthToken();
      console.log(`token is ${token}`);
      // now go to models and define this function there

      //the res.cookie() function is used to set the cookie name to value.
      //the value parameter may be string or object converted to JSON
      res.cookie("jwt", token, {
        //agar expire krna ho cookies ko to
        expires: new Date(Date.now() + 60000), //mtlb jo current time hoga uskay 30 seconds baad
        httpOnly: true, //cookies ki value ko javascript koi change nhi karsakhta chir nhi sakhta
      });
      const registered = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.send("Password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
// login form
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userLogin = await Register.findOne({ email });

    const isMatch = await bcrypt.compare(password, userLogin.password);

    const token = await userLogin.generateAuthToken();
    res.cookie("jwt", token, {
      //agar expire krna ho cookies ko to
      expires: new Date(Date.now() + 60000), //mtlb jo current time hoga uskay 30 seconds baad
      httpOnly: true, //cookies ki value ko javascript koi change nhi karsakhta chir nhi sakhta
    });


    if (isMatch) {
      res.render("index");
    } else {
      res.status(400).send("Invalid Details");
    }
  } catch (error) {
    res.status(500).send("Invalid Details");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/weather", (req, res) => {
  res.render("weather");
});

app.get("*", (req, res) => {
  res.render("404", {
    errorMsg: "Opps! page not found, Click Here to go back",
  });
});

app.listen(port, () => {
  console.log(`listening to the port no at ${port}`);
});
