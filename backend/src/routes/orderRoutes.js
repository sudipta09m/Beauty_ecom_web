import { Router } from "express";
import { createOrder, listOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listOrders);
router.post("/", requireAuth, createOrder);

export default router;

