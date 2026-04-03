import { Router } from "express";
import { createReview, listReviews } from "../controllers/reviewController.js";

const router = Router();

router.get("/:productId", listReviews);
router.post("/:productId", createReview);

export default router;

