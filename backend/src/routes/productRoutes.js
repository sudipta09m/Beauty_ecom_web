import { Router } from "express";
import {
  getProduct,
  listOfferProducts,
  listProducts,
  listTrendingProducts
} from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/trending", listTrendingProducts);
router.get("/offers", listOfferProducts);
router.get("/:id", getProduct);

export default router;

