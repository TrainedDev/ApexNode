export const orderValidation = (orderData) => {
  if (!orderData || !Array.isArray(orderData)) return false;

  const isValid = orderData.every(
    (ele) => ele.productId && ele.buyingPrice && ele.productTitle && ele.qty && ele.productImage
  );

  return isValid;
};
