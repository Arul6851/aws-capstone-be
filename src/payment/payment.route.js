import { Router } from "express";
import PaymentController from "./payment.controller.js";

const payment = Router();
const paymentController = new PaymentController();

payment.post("/", paymentController.handlePayment);
payment.post("/generate", paymentController.generatePaySlip);
payment.post("/tuitionslip", paymentController.generateTuitionPaySlip);
payment.post("/download", paymentController.handleDownload);
payment.post("/generatetoken", paymentController.generateToken);
payment.post("/verify", paymentController.verifyToken);

export default payment;
