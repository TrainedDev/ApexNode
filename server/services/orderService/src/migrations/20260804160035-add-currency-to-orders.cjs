'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("ecommerce_order", "currency", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "INR"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("ecommerce_order", "currency")
  }
};
