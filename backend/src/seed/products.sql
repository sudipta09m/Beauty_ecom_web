USE beauty_ecom;

DROP PROCEDURE IF EXISTS add_product_pricing_columns;

DELIMITER //
CREATE PROCEDURE add_product_pricing_columns()
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'Products'
      AND COLUMN_NAME = 'actual_price'
  ) THEN
    ALTER TABLE Products
    ADD COLUMN actual_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER category;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'Products'
      AND COLUMN_NAME = 'discount_price'
  ) THEN
    ALTER TABLE Products
    ADD COLUMN discount_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER actual_price;
  END IF;
END//
DELIMITER ;

CALL add_product_pricing_columns();
DROP PROCEDURE IF EXISTS add_product_pricing_columns;

DROP PROCEDURE IF EXISTS update_product_stock_column;

DELIMITER //
CREATE PROCEDURE update_product_stock_column()
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'Products'
      AND COLUMN_NAME = 'stock'
      AND DATA_TYPE NOT IN ('varchar', 'char', 'text')
  ) THEN
    ALTER TABLE Products
    MODIFY COLUMN stock VARCHAR(50) NOT NULL DEFAULT 'in stock';
  END IF;
END//
DELIMITER ;

CALL update_product_stock_column();
DROP PROCEDURE IF EXISTS update_product_stock_column;

UPDATE Products
SET stock = CASE
  WHEN stock REGEXP '^[0-9]+$' AND CAST(stock AS UNSIGNED) = 0 THEN 'out of stock'
  WHEN stock REGEXP '^[0-9]+$' THEN 'in stock'
  WHEN stock IS NULL OR TRIM(stock) = '' THEN 'out of stock'
  ELSE stock
END;

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
