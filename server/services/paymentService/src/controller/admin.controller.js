import {  fetchFailedPaymentJobService, retryFailedPaymentJobService, fetchRefundFailedJobService, retryRefundFailedJobService, fetchReconcileFailedJobService, retryReconcilFailedJobService, fetchFailedInitiatePayementJobService, retryFailedInitiatelPaymentJobService } from "../services/adminController.services.js";
import { responseUser } from "../utils/responseUser.utils.js";

export const fetchFailedPaymentJobs = async (req, res) => {
    const response = await fetchFailedPaymentJobService();

     repsonseUser(res, 200, response);
};


export const retryFailedPaymentJobs = async (req, res) => {
    const response = await retryFailedPaymentJobService();

     repsonseUser(res, 200, response);
};


export const fetchFailedRefundJobs = async (req, res) => {
    const response = await fetchRefundFailedJobService();

     repsonseUser(res, 200, response);
};


export const retryFailedRefundJobs = async (req, res) => {
    const response = await retryRefundFailedJobService();

     repsonseUser(res, 200, response);
};


export const fetchFailedReconcileJobs = async (req, res) => {
    const response = await fetchReconcileFailedJobService();

     repsonseUser(res, 200, response);
};


export const retryFailedReconcileJobs = async (req, res) => {
    const response = await retryReconcilFailedJobService();

     repsonseUser(res, 200, response);
};

export const fetchFailedInitiatePaymentJobs = async (req, res) => {
    const response = await fetchFailedInitiatePaymentJobs();

     repsonseUser(res, 200, response);
};


export const retryFailedInitiatePaymentJobs = async (req, res) => {
    const response = await retryFailedInitiatelPaymentJobService();

     repsonseUser(res, 200, response);
};

export const removeAllJobs = async (req, res) => {
    const repsonse = await clearAllJobsService();

    repsonseUser(res, 200, response);
} 