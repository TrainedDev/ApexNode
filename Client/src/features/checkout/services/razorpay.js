import { verifyPayment } from "../paymentSlice";

const loadRazorpay = () => {
  return new Promise((res) => {
    if (window.Razorpay) {
      return res(true);
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.onload = () => res(true);
      existingScript.onerror = () => res(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => res(true);
    script.onerror = () => res(false);

    document.body.appendChild(script);
  });
};

export const handlePayment = async (
  razorpayKeyId,
  amount,
  currency,
  name,
  description,
  razorpayOrderId,
  username,
  phoneNumber,
  dispatch,
  setIsSuccess,
  setIsPaying,
  orderId,
) => {
  const loaded = await loadRazorpay();

  if (!loaded) {
    alert("failed to load razorpay");
    setIsPaying("false");
    setIsSuccess("false");
    return;
  }

  const options = {
    key: razorpayKeyId, // Enter the Key ID generated from the Dashboard
    amount, // Amount is in currency subunits.
    currency,
    name, //your business name
    description,
    // image,
    order_id: razorpayOrderId, // This is a sample Order ID. Pass the `id` obtained in the response of
    handler: async function (response) {
      const data = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        orderId,
      };

      // You can send this data to your server for verification and further processing
      try {
        const res1 = await dispatch(verifyPayment(data)).unwrap();
        if (res1) {
          setIsPaying(false);
          setIsSuccess(true);
          alert
        } else {
          alert(
            "Payment Success , We are finalizing your order status. Please check your Order dashboard in a few minutes.",
          );
        }
      } catch (error) {
        console.log(error);
        setIsSuccess(false);
        setIsPaying(false);
        alert(
          "Payment was successful, but server confirmation timed out. Don't worry, our automated background system (Webhook) will update your order shortly!",
        );
      } finally {
        setIsSuccess(false);
        setIsPaying(false);
      }
    },

    modal: {
      ondismiss: () => {
        setIsPaying(false);
        setIsSuccess(false);
      },
    },

    prefill: {
      name: username,
      email: "gaurav.kumar@example.com",
      contact: phoneNumber,
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp1 = new window.Razorpay(options);
  rzp1.open();
  rzp1.on("payment.failed", (response) => {
    setIsPaying(false);
    setIsSuccess(false);

    alert(response.error.description);
  });
};
