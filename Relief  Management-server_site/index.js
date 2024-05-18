const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("assignment");
    const collection = db.collection("users");
    // User Registration
    app.post("/api/v1/register", async (req, res) => {
      const { name, email, password } = req.body;

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      await collection.insertOne({ name, email, password: hashedPassword });
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    });

    // Current user information
    app.get("/api/v1/user", async (req, res) => {
      console.log(req.query);
      try {
        const email = req.query.email;
        const user = await collection.findOne({ email: email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // User Login
    app.post("/api/v1/login", async (req, res) => {
      const { email, password } = req.body;
      // Find user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // Generate JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
      });
      res.json({
        success: true,
        message: "Login successful",
        token,
      });
    });

    // ==============================Supply data================================

    app.post("/api/v1/supplys", async (req, res) => {
      const Supply = req.body;
      const result = await AllSupplyPost.insertOne(Supply);
      res.send(result);
      console.log(result, "all supply successfully");
    });

    // create Testimonial
    const TestimonialData = db.collection("alltestimonial");
    app.post("/api/v1/testimonial", async (req, res) => {
      const testimonial = req.body;
      const result = await TestimonialData.insertOne(testimonial);
      res.send(result);
      console.log(result, "Comment successfully");
    });
    //  get all Testimonial data
    app.get("/api/v1/testimonial", async (req, res) => {
      let query = {};
      if (req.query.priority) {
        query.priority = req.query.priority;
      }

      const cursor = TestimonialData.find(query);
      const testimonial = await cursor.toArray();
      res.send({ status: true, data: testimonial });
    });
    // create volunteer
    const VolunteerData = db.collection("allvolunteer");
    app.post("/api/v1/volunteer", async (req, res) => {
      const volunteer = req.body;
      const result = await VolunteerData.insertOne(volunteer);
      res.send(result);
      console.log(result, "volunteer successfully");
    });
    //  get all volunteer data
    app.get("/api/v1/volunteer", async (req, res) => {
      let query = {};
      if (req.query.priority) {
        query.priority = req.query.priority;
      }
      const cursor = VolunteerData.find(query);
      const volunteer = await cursor.toArray();
      res.send({ status: true, data: volunteer });
    });
    // create comments for community
    const CommunityComments = db.collection("commnents");
    app.post("/api/v1/community", async (req, res) => {
      const community = req.body;
      const result = await CommunityComments.insertOne(community);
      res.send(result);
      console.log(result, "Comment successfully");
    });
    //  get all commnets data
    app.get("/api/v1/community", async (req, res) => {
      let query = {};
      if (req.query.priority) {
        query.priority = req.query.priority;
      }
      const cursor = CommunityComments.find(query);
      const supply = await cursor.toArray();
      res.send({ status: true, data: supply });
    });
    //  Get All Supply Post
    const AllSupplyPost = db.collection("allsupplypost");
    app.get("/api/v1/supplys", async (req, res) => {
      let query = {};
      if (req.query.priority) {
        query.priority = req.query.priority;
      }
      const cursor = AllSupplyPost.find(query);
      const supply = await cursor.toArray();
      res.send({ status: true, data: supply });
    });
    // get single data
    app.get("/api/v1/supplys/:id", async (req, res) => {
      const id = req.params.id;
      const result = await AllSupplyPost.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    // Edit Supply data
    app.put("/api/v1/supplys/:id", async (req, res) => {
      const id = req.params.id;
      const supply = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          id: supply.id,
          title: supply.title,
          image: supply.image,
          amount: supply.amount,
          description: supply.description,
          category: supply.category,
        },
      };
      const options = { upsert: true };
      const result = await AllSupplyPost.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    //  Delete Supply data
    app.delete("/api/v1/supplys/:id", async (req, res) => {
      const id = req.params.id;
      const result = await AllSupplyPost.deleteOne({
        _id: new ObjectId(id),
      });
      console.log(result);
      res.send(result);
    });
    // Gallery image
    const GalleryImage = db.collection("galleryimage");
    app.get("/api/v1/gellery", async (req, res) => {
      let query = {};
      if (req.query.priority) {
        query.priority = req.query.priority;
      }
      const cursor = GalleryImage.find(query);
      const reliefPost = await cursor.toArray();
      res.send({ status: true, data: reliefPost });
    });
    // ==============================================================

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});