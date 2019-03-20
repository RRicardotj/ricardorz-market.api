const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'review';

const fields = {
  review_id: {
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
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'product_id',
    },
  },
  created_on: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  review: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });


module.exports = model;
