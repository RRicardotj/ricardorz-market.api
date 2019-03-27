const Sequelize = require('sequelize');
const sequelize = require('../common/connection');
const ShoppingCart = require('./ShoppingCart');

const TABLE_NAME = 'cart';

const fields = {
  cartId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    field: 'cart_id',
  },
  customerId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'customer',
      key: 'customer_id',
    },
    field: 'customer_id',
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'created_at',
  },
  isEnabled: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    field: 'isEnabled',
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasMany(ShoppingCart, { as: 'shoppingCarts', foreignKey: 'cart_id' });

module.exports = model;
