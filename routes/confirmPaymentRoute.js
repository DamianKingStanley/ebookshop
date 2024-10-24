import express from "express";
import multer from "multer";
// import upload from "../multer.js";
// const upload = multer();

import { handlePaymentConfirmation } from "../controllers/paymentController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "receipts/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post(
    "/confirm",
    upload.single("transactionReceipt"),
    handlePaymentConfirmation
);

export default router;