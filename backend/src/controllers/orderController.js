import { z } from "zod";
import { getMySqlPool } from "../config/mysql.js";
import { memoryStore } from "../services/store.js";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1)
    })
  )
});

const resolveSqlUserId = async (pool, user) => {
  const numericId = Number(user.id);
  if (Number.isInteger(numericId) && numericId > 0) {
    const [idRows] = await pool.query("SELECT id FROM Users WHERE id = ? LIMIT 1", [numericId]);
    if (idRows[0]?.id) {
      return idRows[0].id;
    }
  }

  const [rows] = await pool.query("SELECT id FROM Users WHERE email = ? LIMIT 1", [user.email]);
  return rows[0]?.id;
};

export const createOrder = async (req, res, next) => {
  try {
    const values = orderSchema.parse(req.body);
    const customer = {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      city: req.user.city
    };

    if (!customer.phone || !customer.address || !customer.city || !customer.email) {
      return res.status(400).json({
        message: "Complete your account details before placing an order."
      });
    }

    const pool = getMySqlPool();
    let order;
    if (pool) {
      const sqlUserId = await resolveSqlUserId(pool, req.user);
      if (!sqlUserId) {
        return res.status(400).json({
          message: "Your account is not linked to the SQL user table yet. Please log out and register or login again."
        });
      }

      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const productIds = values.items.map((item) => item.productId);
        const [productRows] = await connection.query(
          `SELECT id, name, price FROM Products WHERE id IN (${productIds.map(() => "?").join(",")})`,
          productIds
        );
        const productsById = new Map(productRows.map((row) => [Number(row.id), row]));
        const enrichedItems = values.items.map((item) => {
          const product = productsById.get(item.productId);
          const priceAtPurchase = Number(product?.price || 0);
          return {
            productId: item.productId,
            quantity: item.quantity,
            name: product?.name || `Product #${item.productId}`,
            price: priceAtPurchase,
            itemTotal: priceAtPurchase * item.quantity
          };
        });
        const total = values.items.reduce((sum, item) => {
          const product = productsById.get(item.productId);
          return sum + Number(product?.price || 0) * item.quantity;
        }, 0);

        const [orderResult] = await connection.query(
          `INSERT INTO Orders
            (user_id, status, total, customer_name, customer_email, customer_phone, customer_address, customer_city)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sqlUserId,
            "Processing",
            total,
            customer.name,
            customer.email,
            customer.phone,
            customer.address,
            customer.city
          ]
        );

        for (const item of enrichedItems) {
          await connection.query(
            `INSERT INTO OrderItems
              (order_id, product_id, quantity, product_name, price_at_purchase, item_total)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [orderResult.insertId, item.productId, item.quantity, item.name, item.price, item.itemTotal]
          );
        }

        await connection.commit();
        order = {
          id: String(orderResult.insertId),
          userId: String(sqlUserId),
          customer,
          items: enrichedItems,
          total,
          status: "Processing",
          createdAt: new Date().toISOString()
        };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } else {
      const enrichedItems = values.items.map((item) => {
        const product = memoryStore.products.find((entry) => entry.id === item.productId);
        const priceAtPurchase = Number(product?.price || 0);
        return {
          productId: item.productId,
          quantity: item.quantity,
          name: product?.name || `Product #${item.productId}`,
          price: priceAtPurchase,
          itemTotal: priceAtPurchase * item.quantity
        };
      });
      const total = values.items.reduce((sum, item) => {
        const product = memoryStore.products.find((entry) => entry.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);

      order = {
        id: `o${Date.now()}`,
        userId: req.user.id,
        customer,
        items: enrichedItems,
        total,
        status: "Processing",
        createdAt: new Date().toISOString()
      };
      memoryStore.orders.push(order);
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const pool = getMySqlPool();
    if (pool) {
      const sqlUserId = await resolveSqlUserId(pool, req.user);
      if (!sqlUserId) {
        return res.json([]);
      }

      const [orderRows] = await pool.query(
        `SELECT id, user_id, status, total, customer_name, customer_email, customer_phone, customer_address, customer_city, created_at
         FROM Orders
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [sqlUserId]
      );

      const [itemRows] = await pool.query(
        `SELECT order_id, product_id, quantity, product_name, price_at_purchase, item_total
         FROM OrderItems
         WHERE order_id IN (${orderRows.length ? orderRows.map(() => "?").join(",") : "NULL"})`,
        orderRows.length ? orderRows.map((row) => row.id) : []
      );

      const itemsByOrderId = itemRows.reduce((acc, row) => {
        const key = String(row.order_id);
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          productId: Number(row.product_id),
          quantity: Number(row.quantity),
          name: row.product_name,
          price: Number(row.price_at_purchase),
          itemTotal: Number(row.item_total)
        });
        return acc;
      }, {});

      const orders = orderRows.map((row) => ({
        id: String(row.id),
        userId: String(row.user_id),
        status: row.status,
        total: Number(row.total),
        customer: {
          name: row.customer_name,
          email: row.customer_email,
          phone: row.customer_phone,
          address: row.customer_address,
          city: row.customer_city
        },
        items: itemsByOrderId[String(row.id)] || [],
        createdAt: row.created_at
      }));
      return res.json(orders);
    }

    const orders = memoryStore.orders
      .filter((order) => order.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(orders);
  } catch (error) {
    next(error);
  }
};
