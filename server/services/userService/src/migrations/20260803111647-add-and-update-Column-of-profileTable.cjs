"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ecommerce_profile", "area", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("ecommerce_profile", "state", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("ecommerce_profile", "country", {
      type: Sequelize.STRING,
      allowNull: false,
    });


    await queryInterface.renameColumn("ecommerce_profile", "name", "fullName");
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ecommerce_profile", "area");
    await queryInterface.removeColumn("ecommerce_profile", "state");
    await queryInterface.removeColumn("ecommerce_profile", "country");
    await queryInterface.removeColumn("ecommerce_profile", "phoneNumber");

    await queryInterface.renameColumn("ecommerce_profile", "fullName", "name");
  },
};
