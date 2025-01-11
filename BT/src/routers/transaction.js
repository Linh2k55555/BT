import express from 'express';
import { getTransactionHistory } from '../controllers/transactions';

const router = express.Router();


router.get('/history', getTransactionHistory);

export default router;
