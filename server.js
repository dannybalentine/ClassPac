const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/firstdb'; // MongoDB connection URL

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db();

    // Define endpoint to add a user
    app.post('/api/users', async (req, res) => {
      try {
        const { name, age, sex } = req.body;
        
        // Insert the user into the 'students' collection
        const result = await db.collection('students').insertOne({ name, age, sex });

        // Respond with the inserted user object
        res.json(result.ops);
      } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user', message: error.message });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

