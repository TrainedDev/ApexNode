export const verifyReqData = (data) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    tags,
    brand,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    shippingInformation,
    availabilityStatus,
    reviews,
    returnPolicy,
    minimumOrderQuantity,
    meta,
    images,
    thumbnail,
  } = data;

  const updatingFields = {};

  if (title !== undefined && title.trim() !== "") updatingFields.title = title;
  if (description !== undefined && description.trim() !== "")
    updatingFields.description = description;
  if (price !== undefined && !isNaN(price)) updatingFields.price = price;
  if (discountPercentage !== undefined && !isNaN(discountPercentage))
    updatingFields.discountPercentage = discountPercentage;
  if (rating !== undefined && !isNaN(rating)) updatingFields.rating = rating;
  if (stock !== undefined && !isNaN(stock)) updatingFields.stock = stock;
  if (tags !== undefined && Array.isArray(tags) && tags.length > 0)
    updatingFields.tags = tags;
  if (brand !== undefined && brand.trim() !== "") updatingFields.brand = brand;
  if (sku !== undefined && sku.trim() !== "") updatingFields.sku = sku;
  if (weight !== undefined && !isNaN(weight)) updatingFields.weight = weight;
  if (dimensions !== undefined && Object.keys(dimensions).length > 0)
    updatingFields.dimensions = dimensions;
  if (warrantyInformation !== undefined && warrantyInformation.trim() !== "")
    updatingFields.warrantyInformation = warrantyInformation;
  if (shippingInformation !== undefined && shippingInformation.trim() !== "")
    updatingFields.shippingInformation = shippingInformation;
  if (availabilityStatus !== undefined && availabilityStatus.trim() !== "")
    updatingFields.availabilityStatus = availabilityStatus;
  if (reviews !== undefined && Array.isArray(reviews) && reviews.length > 0)
    updatingFields.reviews = reviews;
  if (returnPolicy !== undefined && returnPolicy.trim() !== "")
    updatingFields.returnPolicy = returnPolicy;
  if (minimumOrderQuantity !== undefined && !isNaN(minimumOrderQuantity))
    updatingFields.minimumOrderQuantity = minimumOrderQuantity;
  if (
    meta !== undefined &&
    typeof meta === "object" &&
    Object.keys(meta).length > 0
  )
    updatingFields.meta = meta;
  if (images !== undefined && Array.isArray(images) && images.length > 0)
    updatingFields.images = images;
  if (thumbnail !== undefined && thumbnail.trim() !== "")
    updatingFields.thumbnail = thumbnail;

  return updatingFields;
};
