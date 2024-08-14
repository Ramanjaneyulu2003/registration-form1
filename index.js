const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// Retrieve MongoDB credentials from environment variables
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB using the correct connection string
mongoose.connect(`mongodb+srv://${username}:${password}@ramu.o223vw9.mongodb.net/registrationFormDB`, {
  // Deprecated options are removed
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err));

// Define registration schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Create a model for the registration
const Registration = mongoose.model("Registration", registrationSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route for the home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

// Route for handling registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User already exists");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

// Success page route
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

// Error page route
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
