'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
      ler sobre migrate aqui: https://imasters.com.br/banco-de-dados/tutorial-de-migrations-com-node-js-e-sequelize
     */

     await queryInterface.createTable('Usuario', {
      idusuario: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idcliente: Sequelize.INTEGER,
    id_conta: {
        type:Sequelize.INTEGER.ZEROFILL,        
        allowNull: false
    },
    owner_id: {
        type:Sequelize.INTEGER.ZEROFILL,        
        allowNull: true /* se for usario atendente owner é a conta do seu administrador */
    },
    foto: Sequelize.BLOB,
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING, /* jaderesp@gmail.com */
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING, 
        allowNull: false
    },    
    login: Sequelize.STRING, /* jaderesp */
    senha: Sequelize.TEXT, /* base64: bHVpc0AxMjMzMjE=       to String = luis@123321 */
    descricao: Sequelize.STRING,
    type_user: {
        type: Sequelize.STRING, 
        allowNull: false,
        defaultValue: 'owner', /* dono da conta */
    },
    access_full: {
        type: Sequelize.STRING, 
        allowNull: true,
        defaultValue: 'false',
    }, 
    // Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
      })
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Usuario');
    }

  }