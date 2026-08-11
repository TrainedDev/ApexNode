module.exports = (sq, dataType) => {
  const Order = sq.define(
    "Order",
    {
      id: {
        type: dataType.UUID,
        defaultValue: dataType.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      userId: {
        type: dataType.UUID,
        allowNull: false,
        primaryKey: true,
      },
      paymentStatus: {
        type: dataType.ENUM(
          "failed",
          "pending",
          "paid",
          "pending-refund",
          "refunded",
        ),
        defaultValue: "pending",
      },
      orderStatus: {
        type: dataType.ENUM(
          "cancelled",
          "pending",
          "shipped",
          "delivered",
          "processing",
        ),
        defaultValue: "pending",
      },
      refundStatus: {
        type: dataType.ENUM(
          "pending",
          "processed",
          "failed",
        ),
        defaultValue: null,
      },
      address: {
        type: dataType.STRING,
        allowNull: false,
      },
      currency: {
        type: dataType.STRING,
        allowNull: false,
        defaultValue: "INR",
      },

      totalPrice: {
        type: dataType.INTEGER,
        allowNull: false,
      },

      razorpay_payment_id: {
        type: dataType.STRING,
        defaultValue: null,
      },

      razorpay_order_id: {
        type: dataType.STRING,
        allowNull: false,
      },
      razorpay_refund_id: {
        type: dataType.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "ecommerce_order",
      timestamps: true,
      indexes: [{ fields: ["id"] }],
    },
  );

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      onDelete: "RESTRICT",
    });
  };

  return Order;
};
