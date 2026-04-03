import { z } from "zod";
import { getMySqlPool } from "../config/mysql.js";
import { memoryStore } from "../services/store.js";

const reviewSchema = z.object({
  userName: z.string().min(2),
  rating: z.number().min(1).max(5),
  comment: z.string().min(8)
});

export const listReviews = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const pool = getMySqlPool();
    if (pool) {
      const [reviews] = await pool.query(
        `SELECT id, product_id, user_name, rating, comment, created_at
         FROM Reviews
         WHERE product_id = ?
         ORDER BY created_at DESC`,
        [productId]
      );
      return res.json(
        reviews.map((review) => ({
          id: String(review.id),
          productId: Number(review.product_id),
          userName: review.user_name,
          rating: Number(review.rating),
          comment: review.comment,
          createdAt: review.created_at
        }))
      );
    }
    return res.json(memoryStore.reviews.filter((review) => review.productId === productId));
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const values = reviewSchema.parse(req.body);
    const pool = getMySqlPool();
    let review;

    if (pool) {
      const [result] = await pool.query(
        `INSERT INTO Reviews (product_id, user_name, rating, comment)
         VALUES (?, ?, ?, ?)`,
        [productId, values.userName, values.rating, values.comment]
      );
      review = {
        id: String(result.insertId),
        productId,
        ...values,
        createdAt: new Date().toISOString()
      };
    } else {
      review = {
        id: `r${Date.now()}`,
        productId,
        ...values,
        createdAt: new Date().toISOString()
      };
      memoryStore.reviews.unshift(review);
    }

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};
