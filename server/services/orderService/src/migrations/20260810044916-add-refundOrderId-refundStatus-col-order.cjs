"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ecommerce_order", "refundStatus", {
      type: Sequelize.ENUM("pending", "processed", "failed"),
      defaultValue: null,
    });
    await queryInterface.addColumn("ecommerce_order", "razorpay_refund_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ecommerce_order", "razorpay_refund_id");
    await queryInterface.removeColumn("ecommerce_order", "refundStatus");
  },
};
