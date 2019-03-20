const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'orders';

const fields = {
  order_id: {
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
  shipping_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'shipping',
      key: 'shipping_id',
    },
  },
  tax_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'tax',
      key: 'tax_id',
    },
  },
  total_amount: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
    defaultValue: '0.00',
  },
  created_on: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  shipped_on: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  comments: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  auth_code: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  reference: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });


module.exports = model;
