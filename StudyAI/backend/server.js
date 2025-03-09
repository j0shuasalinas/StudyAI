const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection string and client setup
const uri = "mongodb+srv://joshuasalinas:hqkYZg3LNJXjR9L0@planit.xi7av.mongodb.net/?retryWrites=true&w=majority&appName=PlanIT";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
const port = 5000;

// Middleware to parse JSON data
app.use(express.json());

// Template for assignments
const itemTemplate = {
  ID: 0,
  Title: 'Assignment',
  Class: '',
  Priority: 1,
  DueDate: '',
  TimeDue: '23:59',
  EstimatedTime: 1,
  Completed: false,
  PrioritizeLate: false,
  Exam: false,
  Optional: false,
  color: "#4A90E2"
};

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Route to fetch all assignments from MongoDB
app.get('/assignments', async (req, res) => {
  try {
    const database = client.db("PlanIT");
    const assignmentsCollection = database.collection("assignments");
    const assignments = await assignmentsCollection.find({}).toArray();
    res.json(assignments);
  } catch (err) {
    res.status(500).send("Error fetching assignments");
  }
});

// Route to add a new assignment
app.post('/addAssignment', async (req, res) => {
  const assignment = { ...itemTemplate, ...req.body };

  try {
    const database = client.db("PlanIT");
    const assignmentsCollection = database.collection("assignments");

    // Insert the new assignment
    const result = await assignmentsCollection.insertOne(assignment);
    res.status(201).send(`Assignment added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error("Error inserting assignment:", err);
    res.status(500).send("Failed to add assignment");
  }
});

// Route to update an assignment by ID
app.put('/updateAssignment/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const database = client.db("PlanIT");
    const assignmentsCollection = database.collection("assignments");

    // Update the assignment by ID
    const result = await assignmentsCollection.updateOne(
      { ID: parseInt(id) },  // Assuming IDs are integers
      { $set: updateData }
    );

    if (result.matchedCount > 0) {
      res.send(`Assignment with ID ${id} updated successfully.`);
    } else {
      res.status(404).send("Assignment not found.");
    }
  } catch (err) {
    console.error("Error updating assignment:", err);
    res.status(500).send("Failed to update assignment");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToMongoDB();
});
