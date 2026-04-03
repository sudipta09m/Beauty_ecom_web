USE beauty_ecom;

INSERT INTO Products (id, name, category, price, rating, image_path, image_path_2, image_path_3, description, stock)
VALUES
  (1, 'Rose Velvet Serum', 'Skincare', 38.00, 4.8, '/product-images/rose-velvet-serum.svg', '/product-images/rose-velvet-serum.svg', '/product-images/rose-velvet-serum.svg', 'A glow-boosting serum with rose extract, niacinamide, and hyaluronic acid.', 24),
  (2, 'Soft Matte Lip Cloud', 'Makeup', 22.00, 4.7, '/product-images/soft-matte-lip-cloud.svg', '/product-images/soft-matte-lip-cloud.svg', '/product-images/soft-matte-lip-cloud.svg', 'Air-whipped lip color with a blurred matte finish and comfortable wear.', 43),
  (3, 'Silk Repair Hair Mask', 'Hair Care', 28.00, 4.6, '/product-images/silk-repair-hair-mask.svg', '/product-images/silk-repair-hair-mask.svg', '/product-images/silk-repair-hair-mask.svg', 'A rich mask that smooths dry ends and restores shine in one treatment.', 31),
  (4, 'Coconut Milk Body Wash', 'Bath & Body', 18.00, 4.5, '/product-images/coconut-milk-body-wash.svg', '/product-images/coconut-milk-body-wash.svg', '/product-images/coconut-milk-body-wash.svg', 'Gentle, creamy cleanser with coconut milk and shea for daily softness.', 51),
  (5, 'Amber Bloom Eau de Parfum', 'Fragrance', 56.00, 4.9, '/product-images/amber-bloom-eau-de-parfum.svg', '/product-images/amber-bloom-eau-de-parfum.svg', '/product-images/amber-bloom-eau-de-parfum.svg', 'A warm floral fragrance with amber, peony, and skin-soft musk.', 17),
  (6, 'Cloud Finish Compact', 'Makeup', 26.00, 4.4, '/product-images/cloud-finish-compact.svg', '/product-images/cloud-finish-compact.svg', '/product-images/cloud-finish-compact.svg', 'Weightless setting powder that smooths pores and controls midday shine.', 35)
ON DUPLICATE KEY UPDATE
  category = VALUES(category),
  price = VALUES(price),
  rating = VALUES(rating),
  image_path = VALUES(image_path),
  image_path_2 = VALUES(image_path_2),
  image_path_3 = VALUES(image_path_3),
  description = VALUES(description),
  stock = VALUES(stock);
