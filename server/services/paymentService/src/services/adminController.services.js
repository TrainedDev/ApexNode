import { appError } from "../utils/appError.utils.js";
import {paymentQueue, refundQueue, reconcilePaymentQueue, initiatePaymentQueue} from "../queues/payment.queues.js";

export const fetchFailedPaymentJobService = async () => {
    const failedJobs = await paymentQueue.getFailed();
    
    if(failedJobs.length === 0) appError("no failed payment jobs found", 404);

    const jobs = failedJobs.map(job => {
        return {
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      finishedOn: job.finishedOn,
        }
    })

    return { success: true, count: jobs.length, jobs }
};

export const retryFailedPaymentJobService = async () => {
    const failedJobs = await paymentQueue.getFailed();

    if(failedJobs.length === 0) appError("no failed payment jobs found", 404);

    const retried = 0;

    for (const job of failedJobs) {
        await job.retry();    
        retried ++;
    };

    return {success: true, 
        message: `${retried} failed payment jobs queued for retry`,
      retried,
    }

};

export const fetchRefundFailedJobService = async () => {
    const failedRefundJobs = await refundQueue.getFailed();
    
    if(failedRefundJobs.length === 0) appError("no failed refund jobs found", 404);

    const jobs = failedRefundJobs.map(job => {
        return {
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      finishedOn: job.finishedOn,
        }
    })

    return { success: true, count: jobs.length, jobs }
};

export const retryRefundFailedJobService = async () => {
    const refundfailedJobs = await refundQueue.getFailed();

    if(refundfailedJobs.length === 0) appError("no refund failed jobs found", 404);

    const retried = 0;

    for (const job of refundfailedJobs) {
        await job.retry();    
        retried ++;
    };

    return {success: true, 
        message: `${retried} failed refund jobs queued for retry`,
      retried,
    }

};

export const fetchReconcileFailedJobService = async () => {
    const reconcileFailedJobs = await reconcilePaymentQueue.getFailed();
    
    if(reconcileFailedJobs.length === 0) appError("no reconcile failed jobs found", 404);

    const jobs = reconcileFailedJobs.map(job => {
        return {
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      finishedOn: job.finishedOn,
        }
    })

    return { success: true, count: jobs.length, jobs }
};

export const retryReconcilFailedJobService = async () => {
    const reconcileFailedJobs = await reconcilePaymentQueue.getFailed();

    if(reconcileFailedJobs.length === 0) appError("no reconcile failed jobs found", 404);

    const retried = 0;

    for (const job of reconcileFailedJobs) {
        await job.retry();    
        retried ++;
    };

    return {success: true, 
        message: `${retried} reconcile failed jobs queued for retry`,
      retried,
    }

};

export const fetchFailedInitiatePayementJobService = async () => {
    const reconcileFailedJobs = await initiatePaymentQueue.getFailed();
    
    if(reconcileFailedJobs.length === 0) appError("no initiate_payment failed jobs found", 404);

    const jobs = reconcileFailedJobs.map(job => {
        return {
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      finishedOn: job.finishedOn,
        }
    })

    return { success: true, count: jobs.length, jobs }
};

export const retryFailedInitiatelPaymentJobService = async () => {
    const reconcileFailedJobs = await initiatePaymentQueue.getFailed();

    if(reconcileFailedJobs.length === 0) appError("no initiate_paymen failed jobs found", 404);

    const retried = 0;

    for (const job of reconcileFailedJobs) {
        await job.retry();    
        retried ++;
    };

    return {success: true, 
        message: `${retried} initiate_payment failed jobs queued for retry`,
      retried,
    }

};


export const clearAllJobsService = async () => {
    await paymentQueue.obliterate({ force: true }); 
    await refundQueue.obliterate({ force: true }); 
    await reconcilePaymentQueue.obliterate({ force: true }); 
    await initiatePaymentQueue.obliterate({ force: true }); 

    return { success: true };
}