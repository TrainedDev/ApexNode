'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
    "ecommerce_profile",
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true,  
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
          
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: false,
            
        },
     phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
     },
     createdAt: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         allowNull: false,
     },
     updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.Now,
        allowNull: false,
     }
     }
    )
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable("ecommerce_profile")
  }
};
