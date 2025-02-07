// controllers/AppController.js
import { MongoClient } from 'mongodb';
import redis from 'redis';

// MongoDB and Redis clients initialization
const mongoClient = new MongoClient('mongodb://localhost:27017');
const redisClient = redis.createClient();

// Health check for Redis status
const checkRedis = () => new Promise((resolve, reject) => {
  redisClient.ping((err, res) => {
    if (err) return reject(new Error('Redis is down'));
    resolve(res === 'PONG');
  });
});

// Health check for DB status
const checkDB = async () => {
  try {
    if (!mongoClient.isConnected()) await mongoClient.connect();
    return true;
  } catch (err) {
    return false;
  }
};

const AppController = {
  // GET /status => AppController.getStatus
  getStatus: async (req, res) => {
    try {
      const redisStatus = await checkRedis();
      const dbStatus = await checkDB();

      return res.status(200).json({
        redis: redisStatus,
        db: dbStatus,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to check Redis or DB' });
    }
  },

  // GET /stats => AppController.getStats
  getStats: async (req, res) => {
    try {
      if (!mongoClient.isConnected()) await mongoClient.connect();
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
