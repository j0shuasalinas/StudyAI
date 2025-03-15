const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const uri = "mongodb+srv://joshuasalinas:hqkYZg3LNJXjR9L0@planit.xi7av.mongodb.net/?retryWrites=true&w=majority&appName=PlanIT";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: false,
});

const app = express();
const port = 5001;

// Enable CORS for all origins or specify a domain
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

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

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    const databases = await client.db().admin().listDatabases();
    console.log("Databases:", databases);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

app.get('/assignments', async (req, res) => {
  try {
    const database = client.db("PlanIT");
    const assignmentsCollection = database.collection("assignments");
    const assignments = await assignmentsCollection.find({}).toArray();
    res.json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).send("Error fetching assignments");
  }
});

app.post('/addAssignment', async (req, res) => {
  const assignment = { ...itemTemplate, ...req.body };

  try {
    const database = client.db("PlanIT");
    const assignmentsCollection = database.collection("assignments");

    const result = await assignmentsCollection.insertOne(assignment);
    res.status(201).send(`Assignment added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error("Error inserting assignment:", err);
    res.status(500).send("Failed to add assignment");
  }
});

app.put('/updateAssignment/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const database = client.db("PlanIT");
    const assignmentsCollection = database.collection("assignments");

    const result = await assignmentsCollection.updateOne(
      { ID: parseInt(id) },
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

process.on('SIGINT', async () => {
  try {
    console.log("Shutting down server...");
    await client.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectToMongoDB();
});
