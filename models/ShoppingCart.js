const Sequelize = require('sequelize');
const sequelize = require('../common/connection');
const Product = require('./Product');

const TABLE_NAME = 'shopping_cart';

const fields = {
  itemId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    field: 'item_id',
  },
  cartId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'cart',
      key: 'cart_id',
    },
    field: 'cart_id',
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'product_id',
    },
    field: 'product_id',
  },
  attributes: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  buyNow: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'buy_now',
  },
  addedOn: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'added_on',
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

module.exports = model;
