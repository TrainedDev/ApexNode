module.exports = (sq, datatype) => {
  const Cart = sq.define(
    "Cart",
    {
      id: {
        type: datatype.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: datatype.UUIDV4,
      },

      userId: {
        type: datatype.UUID,
        allowNull: false,
        primaryKey: true,
      },
      productId: {
        type: datatype.STRING,
        allowNull: false,
      },
      quantity: {
        type: datatype.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          len: {
            args: [1, 3],
            msg: "quantity must be between 1 and 3",
          },
        }
      }
    },
    {
      tableName: "ecommerce_cart",
      timestamps: true,
      indexes: [
        {
          fields: [{ name: ["userId", "productId"], unique: true }],
          fields: [{ name: ["productId"], unique: true }],
        },
      ],
      scopes: {
        fetchAllProductsInCart: (userId) => ({
          where: { userId },
        }),
        fetchProductInCart: (userId, productId) => ({
          where: { userId, productId },
        }),
      },
    },
  );

  return Cart;
};
