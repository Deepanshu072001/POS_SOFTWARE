import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

export default router;