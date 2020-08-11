'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn(
      'programas',
      'correoContacto',{
        type: Sequelize.TEXT,
        unique: false,
      },
    )
    queryInterface.addColumn(
      'programas',
      'informacionAdicional',{
        type: Sequelize.TEXT,
        unique: false,
      },
    )
    queryInterface.addColumn(
      'programas',
      'descripcionPrograma',{
        type: Sequelize.TEXT,
        unique: false,
      },
    )
    queryInterface.addColumn(
      'programas',
      'enfasis',{
        type: Sequelize.TEXT,
        unique: false,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
