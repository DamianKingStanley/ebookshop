import Order from "../models/order.js";

export const handleCheckout = async(req, res) => {
    try {
        const { items, totalAmount } = req.body;

        const newOrder = new Order({
            items,
            totalAmount,
        });

        await newOrder.save();

        res
            .status(201)
            .json({ message: "Order successfully created", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error });
    }
};

// Get all orders
export const getOrders = async(req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve orders", error });
    }
};

// Update order status
export const updateOrderStatus = async(req, res) => {
    try {
        const { orderId, status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, { status }, { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status", error });
    }
};