// controllers/UsersController.js
import { MongoClient } from 'mongodb';
import sha1 from 'sha1';

const mongoClient = new MongoClient('mongodb://localhost:27017');
let db;

const connectDB = async () => {
  if (!db) {
    await mongoClient.connect();
    db = mongoClient.db('files_manager');
  }
  return db;
};

const UsersController = {
  // POST /users => UsersController.postNew
  postNew: async (req, res) => {
    const { email, password } = req.body;

    // Check for missing email
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check for missing password
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const db = await connectDB();
      
      // Check if the email already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Create the new user
      const newUser = {
        email,
        password: hashedPassword,
      };

      // Save the new user in the users collection
      const result = await db.collection('users').insertOne(newUser);

      // Respond with the new user (only id and email)
      return res.status(201).json({
        id: result.insertedId,
        email: newUser.email,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export default UsersController;
