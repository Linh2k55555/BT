import express from 'express';
import { addToCart, removeFromCart, checkout } from '../controllers/guestCartController.js';

const router = express.Router();

// Các route của guest cart
router.post('/add', addToCart);
router.delete('/remove', removeFromCart);
router.post('/checkout', checkout);

export default router;
