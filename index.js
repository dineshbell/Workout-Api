const express = require("express");
const mongoose = require("mongoose");
const gymexercise = require("./gymexercise");
const fitnessusers = require("./fitnessusermodel");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const path = require('path');

mongoose
  .connect(
    "mongodb+srv://dineshbellam:bellam@cluster0.dwfidd1.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/register", async (req, res) => {
  try {
    const { username, email, mobile, password, confirmpassword } = req.body;
    const exist = await fitnessusers.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (exist) {
      return res
        .status(400)
        .send({ status: "ok", msg: "User Already Registered" });
    }
    if (username === "" || email === "" || mobile === "" || password === "") {
      return res
        .status(400)
        .send({ status: "notok", msg: "All fields are required" });
    }
    if (password != confirmpassword) {
      return res.status(400).send({
        status: "notok",
        msg: "Passsword & Confirm Password are not matched",
      });
    }

    let newUser = new fitnessusers({
      username,
      email,
      mobile,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(200)
      .send({ status: "ok", msg: "User Registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await fitnessusers.findOne({ email });
    if (!exist) {
      return res.status(400).send({ status: "notok", msg: "User Not Found" });
    }
    const isPasswordMatched = await bcrypt.compare(password, exist.password);
    if (!isPasswordMatched) {
      return res
        .status(400)
        .send({ status: "notok", msg: "Password Invalid" });
    }
    let payload = {
      user: {
        id: exist.id,
      },
    };

    jwt.sign(payload, "jwtPassword", { expiresIn: 360000000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.get("/allexercises", middleware, async (req, res) => {
  try {
    let allexercises = await gymexercises.find();
    return res.json(allexercises);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.get("/exercises/:bodyPart", middleware, async (req, res) => {
  try {
    const { bodyPart } = req.params;
    let allexercises = await gymexercises.find();
    let filteredExercises = allexercises.filter(
      (exercise) => exercise.bodyPart.toString() === bodyPart.toString()
    );
    return res.json(filteredExercises);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.get("/exercises/exercise/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    let allexercises = await gymexercise.find();
    let filteredExercises = allexercises.filter(
      (exercise) => exercise.id.toString() === id.toString()
    );
    return res.json(filteredExercises);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"))
});

app.listen(3006, () => console.log("server running... on 3006"));