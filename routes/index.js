// routes/index.js
import { Router } from 'express';
import AppController from '../controllers/AppController';

const router = Router();

// Define routes and associate them with the controller methods
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

export default router;
