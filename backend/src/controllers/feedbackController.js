import { z } from "zod";
import { getMySqlPool } from "../config/mysql.js";
import { memoryStore } from "../services/store.js";

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(12)
});

const wholesaleSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(8)
});

export const submitFeedback = async (req, res, next) => {
  try {
    const values = feedbackSchema.parse(req.body);
    const pool = getMySqlPool();
    let record;
    if (pool) {
      const [result] = await pool.query(
        `INSERT INTO Feedback (name, email, message)
         VALUES (?, ?, ?)`,
        [values.name, values.email, values.message]
      );
      record = { id: String(result.insertId), ...values, createdAt: new Date().toISOString() };
    } else {
      record = { id: `f${Date.now()}`, ...values, createdAt: new Date().toISOString() };
      memoryStore.feedback.push(record);
    }
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const submitWholesaleLead = async (req, res, next) => {
  try {
    const values = wholesaleSchema.parse(req.body);
    const pool = getMySqlPool();

    if (pool) {
      const [result] = await pool.query(
        `INSERT INTO WholesaleLeads (name, email, phone, address)
         VALUES (?, ?, ?, ?)`,
        [values.name, values.email, values.phone, values.address]
      );
      return res.status(201).json({ id: String(result.insertId), ...values, createdAt: new Date().toISOString() });
    }

    const record = { id: `w${Date.now()}`, ...values, createdAt: new Date().toISOString() };
    memoryStore.wholesaleLeads.push(record);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};
