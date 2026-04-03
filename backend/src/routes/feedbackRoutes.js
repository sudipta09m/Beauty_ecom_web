import { Router } from "express";
import { submitFeedback, submitWholesaleLead } from "../controllers/feedbackController.js";

const router = Router();

router.post("/", submitFeedback);
router.post("/wholesale", submitWholesaleLead);

export default router;

