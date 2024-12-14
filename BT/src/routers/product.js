import express from "express";
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct } from "../controllers/product";

const router = express.Router();

router.get(`/products`, getProducts);
router.get(`/products/:id`, getProductsById);
router.post(`/products`, addProduct);
router.put(`/products/:id`, updateProduct);  
router.delete(`/products/:id`, deleteProduct);

export default router;