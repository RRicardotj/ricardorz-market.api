const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'shopping_cart';

const fields = {
  item_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  cart_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'cart',
      key: 'cart_id',
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
    allowNull: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  buy_now: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  added_on: {
    type: Sequelize.DATE,
    allowNull: false,
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });


module.exports = model;
