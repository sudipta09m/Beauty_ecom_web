import bcrypt from "bcryptjs";
import { z } from "zod";
import { getMySqlPool } from "../config/mysql.js";
import { memoryStore } from "../services/store.js";
import { signToken } from "../utils/jwt.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(8),
  city: z.string().min(2),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const register = async (req, res, next) => {
  try {
    const values = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(values.password, 10);

    let user;
    const pool = getMySqlPool();
    if (pool) {
      const [existingRows] = await pool.query("SELECT id FROM Users WHERE email = ?", [values.email]);
      const exists = existingRows[0];
      if (exists) {
        return res.status(409).json({ message: "Email already registered." });
      }

      const [result] = await pool.query(
        `INSERT INTO Users (name, email, phone, address, city, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [values.name, values.email, values.phone, values.address, values.city, passwordHash]
      );

      user = {
        id: String(result.insertId),
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city
      };
    } else {
      const exists = memoryStore.users.find((item) => item.email === values.email);
      if (exists) {
        return res.status(409).json({ message: "Email already registered." });
      }
      user = {
        id: `u${Date.now()}`,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        passwordHash
      };
      memoryStore.users.push(user);
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      city: user.city
    });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const values = loginSchema.parse(req.body);

    let user;
    const pool = getMySqlPool();
    if (pool) {
      const [rows] = await pool.query(
        `SELECT id, name, email, phone, address, city, password_hash
         FROM Users
         WHERE email = ?`,
        [values.email]
      );
      user = rows[0]
        ? {
            id: String(rows[0].id),
            name: rows[0].name,
            email: rows[0].email,
            phone: rows[0].phone,
            address: rows[0].address,
            city: rows[0].city,
            passwordHash: rows[0].password_hash
          }
        : undefined;
    } else {
      user = memoryStore.users.find((item) => item.email === values.email);
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const match = await bcrypt.compare(values.password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      city: user.city
    });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city
      }
    });
  } catch (error) {
    next(error);
  }
};
