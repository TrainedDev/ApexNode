"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ecommerce_profile", "userId", {
      type: Sequelize.UUID,
      primaryKey: true,
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ecommerce_profile", "userId");
  },
};
