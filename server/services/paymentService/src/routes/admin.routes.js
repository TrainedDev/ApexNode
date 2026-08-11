import express from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import {
  fetchFailedPaymentJobs,
  retryFailedPaymentJobs,
  fetchFailedRefundJobs,
  retryFailedRefundJobs,
  fetchFailedReconcileJobs,
  retryFailedReconcileJobs,
  fetchFailedInitiatePaymentJobs,
  retryFailedInitiatePaymentJobs,
  removeAllJobs,
} from "../controller/admin.controller.js";


const router = express.Router();

router.get("/failed", asyncHandler(fetchFailedPaymentJobs));
router.get("/retry-failed", asyncHandler(retryFailedPaymentJobs));

router.get("/refund-failed", asyncHandler(fetchFailedRefundJobs));
router.get("/refund/retry-failed", asyncHandler(retryFailedRefundJobs));

router.get("/reconcile/failed", asyncHandler(fetchFailedReconcileJobs));
router.get("/reconcile/retry-failed", asyncHandler(retryFailedReconcileJobs));

router.get("/initiate-payment/failed", asyncHandler(fetchFailedInitiatePaymentJobs));
router.get("/initiate-payment/retry-failed", asyncHandler(retryFailedInitiatePaymentJobs));

router.delete("/queue-jobs/delete", asyncHandler(removeAllJobs));

export default router;
