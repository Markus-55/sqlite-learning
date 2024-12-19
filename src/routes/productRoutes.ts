import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getProductByID, updateProduct } from '../controllers/productController.js'

const router = express.Router();

router.post('/', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductByID);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

export default router;
