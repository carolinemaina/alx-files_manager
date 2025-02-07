// controllers/AppController.js
import { MongoClient } from 'mongodb';
import redis from 'redis';

// MongoDB and Redis clients initialization
const mongoClient = new MongoClient('mongodb://localhost:27017');
const redisClient = redis.createClient();

// Health check for Redis and DB status
const checkRedis = async () => {
  return new Promise((resolve, reject) => {
    redisClient.ping((err, res) => {
      if (err) reject(false);
      resolve(res === 'PONG');
    });
  });
};

const checkDB = async () => {
  try {
    await mongoClient.connect();
    return true;
  } catch (err) {
    return false;
  }
};

const AppController = {
  // GET /status => AppController.getStatus
  getStatus: async (req, res) => {
    const redisStatus = await checkRedis();
    const dbStatus = await checkDB();

    return res.status(200).json({
      redis: redisStatus,
      db: dbStatus,
    });
  },

  // GET /stats => AppController.getStats
  getStats: async (req, res) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db('files_manager');
      const usersCount = await db.collection('users').countDocuments();
      const filesCount = await db.collection('files').countDocuments();

      return res.status(200).json({
        users: usersCount,
        files: filesCount,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },
};

export default AppController;
