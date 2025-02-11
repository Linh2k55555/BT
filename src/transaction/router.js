import express from 'express';
import { getTransactionHistory } from '../transaction/controller';

const router = express.Router();


router.get('/history', getTransactionHistory);

export default router;
