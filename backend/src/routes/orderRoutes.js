import { Router } from "express";
import { cancelOrder, createOrder, listOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listOrders);
router.post("/", requireAuth, createOrder);
router.patch("/:id/cancel", requireAuth, cancelOrder);

export default router;
