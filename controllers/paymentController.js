import Order from "../models/order.js";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "receipts/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

export const handlePaymentConfirmation = async(req, res) => {
    try {
        const { transactionId, bankName } = req.body;
        const transactionReceipt = req.file ?
            `receipts/${req.file.filename}` :
            null;

        if (!transactionReceipt) {
            return res.status(400).json({ error: "Inlcude the payment Receipt" });
        }

        // Save this data as part of the order, marking it as "pending verification"
        const newPaymentConfirmation = {
            transactionId,
            bankName,
            transactionReceipt,
        };

        // Store the payment confirmation or update the order status
        const order = await Order.findOneAndUpdate({ _id: req.body.orderId }, // Assuming you have the order ID
            {
                paymentConfirmation: newPaymentConfirmation,
                status: "Pending Verification",
            }, { new: true }
        );

        if (order) {
            res
                .status(200)
                .json({ message: "Payment proof submitted successfully", order });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error processing payment confirmation", error });
    }
};