CREATE DATABASE IF NOT EXISTS beauty_ecom;
USE beauty_ecom;

CREATE TABLE IF NOT EXISTS Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  actual_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  discount_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 4.5,
  image_path TEXT NOT NULL,
  image_path_2 TEXT NULL,
  image_path_3 TEXT NULL,
  description TEXT NOT NULL,
  stock VARCHAR(50) NOT NULL DEFAULT 'in stock'
);

CREATE TABLE IF NOT EXISTS Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'Processing',
  total DECIMAL(10, 2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OrderItems (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  item_total DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS WholesaleLeads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
JOIN OrderItems oi ON oi.order_id = o.id;

INSERT INTO Products (id, name, category, actual_price, discount_price, price, rating, image_path, image_path_2, image_path_3, description, stock)
VALUES
  (1, 'Rose Velvet Serum', 'Skincare', 48.00, 10.00, 38.00, 4.8, 'rose-velvet-serum.svg', 'rose-velvet-serum.svg', 'rose-velvet-serum.svg', 'A glow-boosting serum with rose extract, niacinamide, and hyaluronic acid.', 'in stock'),
  (2, 'Soft Matte Lip Cloud', 'Makeup', 28.00, 6.00, 22.00, 4.7, 'soft-matte-lip-cloud.svg', 'soft-matte-lip-cloud.svg', 'soft-matte-lip-cloud.svg', 'Air-whipped lip color with a blurred matte finish and comfortable wear.', 'in stock'),
  (3, 'Silk Repair Hair Mask', 'Hair Care', 36.00, 8.00, 28.00, 4.6, 'silk-repair-hair-mask.svg', 'silk-repair-hair-mask.svg', 'silk-repair-hair-mask.svg', 'A rich mask that smooths dry ends and restores shine in one treatment.', 'in stock'),
  (4, 'Coconut Milk Body Wash', 'Bath & Body', 24.00, 6.00, 18.00, 4.5, 'coconut-milk-body-wash.svg', 'coconut-milk-body-wash.svg', 'coconut-milk-body-wash.svg', 'Gentle, creamy cleanser with coconut milk and shea for daily softness.', 'in stock'),
  (5, 'Amber Bloom Eau de Parfum', 'Fragrance', 70.00, 14.00, 56.00, 4.9, 'amber-bloom-eau-de-parfum.svg', 'amber-bloom-eau-de-parfum.svg', 'amber-bloom-eau-de-parfum.svg', 'A warm floral fragrance with amber, peony, and skin-soft musk.', 'in stock'),
  (6, 'Cloud Finish Compact', 'Makeup', 32.00, 6.00, 26.00, 4.4, 'cloud-finish-compact.svg', 'cloud-finish-compact.svg', 'cloud-finish-compact.svg', 'Weightless setting powder that smooths pores and controls midday shine.', 'in stock')
ON DUPLICATE KEY UPDATE
  category = VALUES(category),
  actual_price = VALUES(actual_price),
  discount_price = VALUES(discount_price),
  price = VALUES(price),
  rating = VALUES(rating),
  image_path = VALUES(image_path),
  image_path_2 = VALUES(image_path_2),
  image_path_3 = VALUES(image_path_3),
  description = VALUES(description),
  stock = VALUES(stock);
