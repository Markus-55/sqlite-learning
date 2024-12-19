import { NextFunction, Request, Response } from "express";
import { sqlDatabase } from "../connectDB.js";
import ErrorResponse from "../models/ErrorResponse.js";
import ResponseModel from "../models/ResponseModel.js";
import { executeQuery, fetchAllRows, fetchSingleRow } from "../utils/sqlQueries.js";
import { Product } from "../models/ProductModel.js";
import { ProductStatus } from "../enums/productStatus.js";

export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, price } = req.body;

  if (!name || !price) {
    return next(new ErrorResponse('Name and price are required.', 400));
    // return res.status(400).json({ success: false, message: 'Name and price are required.' });
  }

  const sql: string = `INSERT INTO products(name, price) VALUES(?, ?)`;

  try {
    const product: Product = { 
      name, 
      price
    }

    await executeQuery<string | number>(sqlDatabase, sql, [product.name, product.price]);

    res.status(201).json(new ResponseModel({
      statusCode: 201,
      data: product
    }));

    // res.status(201).json({ success: true, statusCode: 201, data: { name, price } })
  } catch (err) {
    return next(new ErrorResponse('Failed to add product.', 500));
    // res.status(500).json({ success: false, message: 'Failed to add product.' });
  }
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const sql = 'SELECT * FROM products ORDER BY id';

  try {
    const fetchAll = await fetchAllRows(sqlDatabase, sql);

    res.status(200).json(new ResponseModel({
      statusCode: 200,
      data: fetchAll,
    }));

    // res.status(200).json({ success: true, statusCode: 200, data })
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse('Failed to fetch products.', 500));
    // res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
}

export const getProductByID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  const { id } = req.params;
  const productID = Number(id);

  try {
    const fetchProduct = await fetchSingleRow<Product>(sqlDatabase, sql, [productID]);

    if (!fetchProduct) {
      return next(new ErrorResponse(`Product with id ${productID} not found.`, 404));
      // return res.status(404).json({ success: false, message: `Product with id ${id} not found.` });
    }

    res.status(200).json(new ResponseModel({
      statusCode: 200,
      data: fetchProduct,
    }));

    // res.status(200).json({ success: true, statusCode: 200, data: product })
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse(`Failed to fetch product with id ${productID}.`, 500));
    // res.status(500).json({ success: false, message: `Failed to fetch product with id ${id}.` });
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, price } = req.body;
  const { id } = req.params;
  const productID = Number(id);

  if (!name || !price) {
    return next(new ErrorResponse('Name and price are required.', 400));
    // return res.status(400).json({ success: false, message: 'Name and price are required.' });
  }
  const sqlUpdate = `UPDATE products SET name = ?, price = ? WHERE id = ?`;
  const sqlSelectId = 'SELECT * FROM products WHERE id = ?';

  try {
    const fetchProduct = await fetchSingleRow<Product>(sqlDatabase, sqlSelectId, [productID]);

    if (!fetchProduct) {
      return next(new ErrorResponse(`Product with id ${productID} not found.`, 404));
      // return res.status(404).json({ success: false, message: `Product with id ${id} not found.` });
    }
    
    const product: Product = { name, price }
    await executeQuery(sqlDatabase, sqlUpdate, [product.name, product.price, productID]);
    res.status(204).json(new ResponseModel({
      statusCode: 204,
      message: 'Product updated successfully.',
    }));

    // res.status(204).json({ success: true, message: 'Product updated successfully.' });
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse(`Failed to update product with id ${productID}.`, 500));
    // res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const productID = Number(id);

  const sqlDelete = 'DELETE FROM products WHERE id = ?';
  const sqlSelectId = 'SELECT * FROM products WHERE id = ?';

  try {
    const fetchProduct = await fetchSingleRow<Product>(sqlDatabase, sqlSelectId, [productID]);

    if (!fetchProduct) {
      return next(new ErrorResponse(`Product with id ${productID} not found.`, 404));
      // return res.status(404).json({ success: false, message: `Product with id ${id} not found.` });
    }

    await executeQuery(sqlDatabase, sqlDelete, [productID]);
    res.status(200).json(new ResponseModel({
      statusCode: 204,
      message: 'Product deleted successfully.',
    }));

    // res.status(204).json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse(`Failed to delete product with id ${productID}.`, 500));
    // res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}
