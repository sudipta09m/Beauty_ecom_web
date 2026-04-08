import mysql from "mysql2/promise";
import { env } from "./env.js";

let pool;

const ensureSchema = async () => {
  const [productImage2Rows] = await pool.query(
    `
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'Products'
        AND COLUMN_NAME = 'image_path_2'
      LIMIT 1
    `,
    [env.mysql.database]
  );

  if (!productImage2Rows[0]) {
    await pool.query(`
      ALTER TABLE Products
      ADD COLUMN image_path_2 TEXT NULL AFTER image_path
    `);
  }

  const [productImage3Rows] = await pool.query(
    `
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'Products'
        AND COLUMN_NAME = 'image_path_3'
      LIMIT 1
    `,
    [env.mysql.database]
  );

  if (!productImage3Rows[0]) {
    await pool.query(`
      ALTER TABLE Products
      ADD COLUMN image_path_3 TEXT NULL AFTER image_path_2
    `);
  }

  const [columnRows] = await pool.query(
    `
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'OrderItems'
        AND COLUMN_NAME = 'item_total'
      LIMIT 1
    `,
    [env.mysql.database]
  );

  if (!columnRows[0]) {
    await pool.query(`
      ALTER TABLE OrderItems
      ADD COLUMN item_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER price_at_purchase
    `);
  }

  await pool.query(`
    UPDATE OrderItems
    SET item_total = quantity * price_at_purchase
    WHERE item_total = 0.00
  `);

  await pool.query(`
    CREATE OR REPLACE VIEW OrderCustomerProducts AS
    SELECT
      o.id AS order_id,
      o.created_at AS ordered_at,
      o.status,
      o.total AS order_total,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone,
      u.address AS user_address,
      u.city AS user_city,
      oi.product_id,
      oi.product_name,
      oi.quantity,
      oi.price_at_purchase,
      oi.item_total
    FROM Orders o
    JOIN Users u ON u.id = o.user_id
    JOIN OrderItems oi ON oi.order_id = o.id
  `);

  const productImageMap = [
    ["Rose Velvet Serum", "rose-velvet-serum.svg"],
    ["Soft Matte Lip Cloud", "soft-matte-lip-cloud.svg"],
    ["Silk Repair Hair Mask", "silk-repair-hair-mask.svg"],
    ["Coconut Milk Body Wash", "coconut-milk-body-wash.svg"],
    ["Amber Bloom Eau de Parfum", "amber-bloom-eau-de-parfum.svg"],
    ["Cloud Finish Compact", "cloud-finish-compact.svg"]
  ];

  for (const [productName, imagePath] of productImageMap) {
    await pool.query(
      `
        UPDATE Products
        SET
          image_path = COALESCE(NULLIF(image_path, ''), ?),
          image_path_2 = COALESCE(NULLIF(image_path_2, ''), ?),
          image_path_3 = COALESCE(NULLIF(image_path_3, ''), ?)
        WHERE name = ?
      `,
      [imagePath, imagePath, imagePath, productName]
    );
  }
};

export const connectMySql = async () => {
  if (!env.mysql.host || !env.mysql.user || !env.mysql.database) {
    return false;
  }

  try {
    pool = mysql.createPool({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
      database: env.mysql.database,
      waitForConnections: true,
      connectionLimit: 10
    });

    await pool.query("SELECT 1");
    await ensureSchema();
    console.log("MySQL connected");
    return true;
  } catch (error) {
    console.warn("MySQL unavailable, using in-memory fallback.");
    console.warn("MySQL error details:", error.code || error.message, error.sqlMessage || "");
    pool = undefined;
    return false;
  }
};

export const getMySqlPool = () => pool;
