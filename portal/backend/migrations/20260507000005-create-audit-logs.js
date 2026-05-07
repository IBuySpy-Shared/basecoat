'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      action: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      resourceType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      resourceId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: true,
      },
      ipAddress: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};
