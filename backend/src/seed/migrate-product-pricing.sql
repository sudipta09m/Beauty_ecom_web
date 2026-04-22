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

UPDATE Products
SET
  actual_price = CASE WHEN actual_price = 0.00 THEN price ELSE actual_price END,
  discount_price = CASE WHEN discount_price < 0.00 THEN 0.00 ELSE discount_price END;
