const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'customer';

const fields = {
  customer_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(50),
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING(50),
  },
  credit_card: {
    allowNull: true,
    type: Sequelize.TEXT,
  },
  address_1: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  address_2: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  city: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  region: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  postal_code: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  country: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  shipping_region_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'shipping_region',
      key: 'shipping_region_id',
    },
  },
  day_phone: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  eve_phone: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  mob_phone: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

module.exports = model;
