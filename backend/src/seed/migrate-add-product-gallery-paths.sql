USE beauty_ecom;

SET @has_image_path_2 = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Products'
    AND COLUMN_NAME = 'image_path_2'
);
SET @sql = IF(
  @has_image_path_2 = 0,
  'ALTER TABLE Products ADD COLUMN image_path_2 TEXT NULL AFTER image_path',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_image_path_3 = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Products'
    AND COLUMN_NAME = 'image_path_3'
);
SET @sql = IF(
  @has_image_path_3 = 0,
  'ALTER TABLE Products ADD COLUMN image_path_3 TEXT NULL AFTER image_path_2',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE Products
SET
  image_path_2 = COALESCE(image_path_2, image_path),
  image_path_3 = COALESCE(image_path_3, image_path);
