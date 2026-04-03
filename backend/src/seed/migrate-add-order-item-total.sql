USE beauty_ecom;

ALTER TABLE OrderItems
  ADD COLUMN IF NOT EXISTS item_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER price_at_purchase;

UPDATE OrderItems
SET item_total = quantity * price_at_purchase;
