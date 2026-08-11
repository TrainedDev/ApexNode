"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ecommerce_order_item",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          unique: true,
          allowNull: false,
        },
        productId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        buyingPrice: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        qty: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        productTitle: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        orderId: {
          type: Sequelize.UUID,
          references: {
            model: "ecommerce_order",
            key: "id",
          },
          allowNull: false,
          onDelete: "CASCADE",
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ecommerce_order_item");
  },
};
