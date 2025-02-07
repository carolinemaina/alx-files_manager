// controllers/UsersController.js
import { MongoClient } from 'mongodb';
import sha1 from 'sha1';

const mongoClient = new MongoClient('mongodb://localhost:27017');

// POST /users => UsersController.postNew
const postNew = async (req, res) => {
  const { email, password } = req.body;

  // Validate the input data
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    // Connect to MongoDB
    if (!mongoClient.isConnected()) await mongoClient.connect();
    const db = mongoClient.db('files_manager');

    // Check if email already exists in the database
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create a new user document
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert the new user into the users collection
    const result = await db.collection('users').insertOne(newUser);

    // Return the newly created user (only email and id)
    return res.status(201).json({
      id: result.insertedId,
      email: result.ops[0].email,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

export default { postNew };
