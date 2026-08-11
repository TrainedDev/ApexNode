"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ecommerce_order_item", null, {});
    await queryInterface.bulkDelete("ecommerce_order", null, {});

    await queryInterface.removeColumn("ecommerce_order", "paymentStatus");
    await queryInterface.addColumn("ecommerce_order", "paymentStatus", {
      type: Sequelize.ENUM(
        "pending",
        "failed",
        "paid",
        "pending-refund",
        "refunded",
      ),
      allowNull: false,
      defaultValue: "pending",
    });

    await queryInterface.addColumn("ecommerce_order", "orderStatus", {
      type: Sequelize.ENUM(
        "cancelled",
        "pending",
        "shipped",
        "delivered",
        "processing",
      ),
      allowNull: false,
      defaultValue: "pending"
    });

    await queryInterface.addColumn("ecommerce_order_item", "productImage", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ecommerce_order_item", "productImage");
    await queryInterface.removeColumn("ecommerce_order", "paymentStatus");
    await queryInterface.removeColumn("ecommerce_order", "orderStatus");
  },
};
