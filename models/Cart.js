const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'cart';

const fields = {
  cart_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  customer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'customer',
      key: 'customer_id',
    },
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  isEnabled: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

module.exports = model;
