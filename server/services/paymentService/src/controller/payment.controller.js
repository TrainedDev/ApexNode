import { razorpayWebHookService, verifyPaymentService } from "../services/paymentController.services.js";
import { appError } from "../utils/appError.utils.js";
import { responseUser } from "../utils/responseUser.utils.js";


export const verifyPayment = async (req, res) => {
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId} = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) appError("required data not found", 400);

    const response = await verifyPaymentService(razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId);

    responseUser(res, 200, response);
};

export const razorpayWebHook = async (req, res) => {
    if(!req.body || !req.headers) appError("required data not found", 400);

    const response = await razorpayWebHookService(req.body, req.headers);

    responseUser(res, 200, response);
};