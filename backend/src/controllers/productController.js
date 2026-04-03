import { z } from "zod";
import { env } from "../config/env.js";
import { getMySqlPool } from "../config/mysql.js";
import { memoryStore } from "../services/store.js";
import { notFound } from "../utils/http.js";

const filterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  search: z.string().optional()
});

const normalizeImagePath = (imagePath, req) => {
  if (!imagePath) {
    return imagePath;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const normalizedPathSource = imagePath.startsWith("/public/") ? imagePath.replace(/^\/public/, "") : imagePath;
  const normalizedPath = normalizedPathSource
    .replace(/^public\//, "")
    .replace(/^\/?backend\/public\//, "")
    .replace(/^product-images\//, "product-images/");

  const relativePath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  const baseUrl = env.assetBaseUrl || env.publicBaseUrl || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl.replace(/\/$/, "")}${relativePath}`;
};

const applyFilters = (products, filters) =>
  products.filter((product) => {
    const matchesCategory = !filters.category || filters.category === "All" || product.category === filters.category;
    const matchesMin = filters.minPrice === undefined || product.price >= filters.minPrice;
    const matchesMax = filters.maxPrice === undefined || product.price <= filters.maxPrice;
    const matchesRating = filters.rating === undefined || product.rating >= filters.rating;
    const matchesSearch =
      !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesMin && matchesMax && matchesRating && matchesSearch;
  });

const mapProductRow = (row, req) => ({
  id: Number(row.id),
  name: row.name,
  category: row.category,
  price: Number(row.price),
  image_path: normalizeImagePath(row.image_path, req),
  image_path_2: normalizeImagePath(row.image_path_2 || row.image_path, req),
  image_path_3: normalizeImagePath(row.image_path_3 || row.image_path, req),
  stock: Number(row.stock),
  rating: Number(row.rating),
  description: row.description
});

export const listProducts = async (req, res, next) => {
  try {
    const filters = filterSchema.parse(req.query);
    const pool = getMySqlPool();

    let products = memoryStore.products;
    if (pool) {
      const [rows] = await pool.query(
        "SELECT id, name, category, price, rating, image_path, image_path_2, image_path_3, description, stock FROM Products"
      );
      products = rows.map((row) => mapProductRow(row, req));
    }

    res.json(
      applyFilters(
        products.map((product) => ({
          ...product,
          image_path: normalizeImagePath(product.image_path, req),
          image_path_2: normalizeImagePath(product.image_path_2 || product.image_path, req),
          image_path_3: normalizeImagePath(product.image_path_3 || product.image_path, req)
        })),
        filters
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const pool = getMySqlPool();
    let product = memoryStore.products.find((item) => item.id === productId);
    let reviews = memoryStore.reviews.filter((review) => review.productId === productId);

    if (pool) {
      const [productRows] = await pool.query(
        "SELECT id, name, category, price, rating, image_path, image_path_2, image_path_3, description, stock FROM Products WHERE id = ? LIMIT 1",
        [productId]
      );
      product = productRows[0] ? mapProductRow(productRows[0], req) : undefined;
      const [reviewRows] = await pool.query(
        `SELECT id, product_id, user_name, rating, comment, created_at
         FROM Reviews
         WHERE product_id = ?
         ORDER BY created_at DESC`,
        [productId]
      );
      reviews = reviewRows.map((review) => ({
        id: String(review.id),
        productId: Number(review.product_id),
        userName: review.user_name,
        rating: Number(review.rating),
        comment: review.comment,
        createdAt: review.created_at
      }));
    }

    if (!product) {
      return notFound(res, "Product");
    }

    res.json({
      ...product,
      image_path: normalizeImagePath(product.image_path, req),
      image_path_2: normalizeImagePath(product.image_path_2 || product.image_path, req),
      image_path_3: normalizeImagePath(product.image_path_3 || product.image_path, req),
      reviews
    });
  } catch (error) {
    next(error);
  }
};

export const listTrendingProducts = async (req, res, next) => {
  try {
    const pool = getMySqlPool();
    const items = pool
      ? (
          await pool.query(
            "SELECT id, name, category, price, rating, image_path, image_path_2, image_path_3, description, stock FROM Products ORDER BY rating DESC LIMIT 4"
          )
        )[0].map((row) => mapProductRow(row, req))
      : [...memoryStore.products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4)
          .map((product) => ({
            ...product,
            image_path: normalizeImagePath(product.image_path, req),
            image_path_2: normalizeImagePath(product.image_path_2 || product.image_path, req),
            image_path_3: normalizeImagePath(product.image_path_3 || product.image_path, req)
          }));
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const listOfferProducts = async (req, res, next) => {
  try {
    const pool = getMySqlPool();
    const baseItems = pool
      ? (
          await pool.query(
            "SELECT id, name, category, price, rating, image_path, image_path_2, image_path_3, description, stock FROM Products LIMIT 4"
          )
        )[0].map((row) => mapProductRow(row, req))
      : memoryStore.products
          .slice(0, 4)
          .map((product) => ({
            ...product,
            image_path: normalizeImagePath(product.image_path, req),
            image_path_2: normalizeImagePath(product.image_path_2 || product.image_path, req),
            image_path_3: normalizeImagePath(product.image_path_3 || product.image_path, req)
          }));
    const items = baseItems.map((product, index) => ({
      ...product,
      offerLabel: index % 2 === 0 ? "15% Off" : "Bundle Save"
    }));
    res.json(items);
  } catch (error) {
    next(error);
  }
};
