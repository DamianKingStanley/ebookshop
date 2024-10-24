import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    items: [{
        title: { type: String, required: true },
        author: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        bookcover: { type: String },
    }, ],
    totalAmount: { type: Number, required: true },
    paymentConfirmation: {
        transactionId: { type: String },
        bankName: { type: String },
        transactionReceipt: { type: String }, // path to the uploaded file
    },
    status: { type: String, default: "Pending Verification" }, // Status of payment
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Order", orderSchema);