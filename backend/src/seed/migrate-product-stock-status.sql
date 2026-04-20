USE beauty_ecom;

ALTER TABLE Products
MODIFY COLUMN stock VARCHAR(50) NOT NULL DEFAULT 'in stock';

UPDATE Products
SET stock = CASE
  WHEN stock REGEXP '^[0-9]+$' AND CAST(stock AS UNSIGNED) = 0 THEN 'out of stock'
  WHEN stock REGEXP '^[0-9]+$' THEN 'in stock'
  WHEN stock IS NULL OR TRIM(stock) = '' THEN 'out of stock'
  ELSE stock
END;
