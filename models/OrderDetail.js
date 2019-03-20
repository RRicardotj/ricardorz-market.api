const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'order_detail';

const fields = {
  item_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'order_id',
    },
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'product_id',
    },
  },
  attributes: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  product_name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  unit_cost: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });


module.exports = model;
