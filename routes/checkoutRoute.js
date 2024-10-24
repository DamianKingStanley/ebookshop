import express from "express";
import {
    handleCheckout,
    getOrders,
    updateOrderStatus,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/checkout", handleCheckout);

// Route for fetching all orders
router.get("/orders", getOrders);

// Route for updating order status
router.put("/orders/update-status", updateOrderStatus);

export default router;