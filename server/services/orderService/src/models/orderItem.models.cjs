module.exports = (sq, dataType) => {
  const OrderItem = sq.define("OrderItem", {
    id: {
      type: dataType.UUID,
      defaultValue: dataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    productId: {
      type: dataType.STRING,
      allowNull: false,
    },
    buyingPrice: {
      type: dataType.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "price should be greater than 0",
        },
      },
    },
    qty: {
      type: dataType.INTEGER,
      allowNull: false,
      validate: {
        len: {
          args: [1, 3],
          msg: "max 3 product can be order and minimum 1",
        },
      },
    },
    productTitle: {
      type: dataType.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[a-z\s-]+$/i,
          msg: "title should contain only alphabets , space and hyphen",
        },
      },
    },
    productImage: {
      type: dataType.STRING,
      allowNull: false,
    }
  }, {
    tableName: "ecommerce_order_item",
    timestamp: true,
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
  };

  return OrderItem;
};
