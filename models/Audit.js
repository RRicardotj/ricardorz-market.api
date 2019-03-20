const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'audit';

const fields = {
  audit_id: {
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
  created_on: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  code: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });


module.exports = model;
