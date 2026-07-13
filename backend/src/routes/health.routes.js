import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CafeFlow POS API is running",
        version: "1.0.0",
        environment: process.env.NODE_ENV,
        timestamp: new Date()
    });
});

export default router;