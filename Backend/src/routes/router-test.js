import express from 'express';
import { processAnswers } from '../controllers/result.js';

const router = express.Router();

router.post('/respostas', processAnswers );

export {
    router
};

