const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'customer';

const fields = {
  customerId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    field: 'customer_id',
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(50),
    field: 'name',
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING(100),
    field: 'email',
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING(50),
    field: 'password',
  },
  creditCard: {
    allowNull: true,
    type: Sequelize.TEXT,
    field: 'credit_card',
  },
  address1: {
    allowNull: true,
    type: Sequelize.STRING(100),
    field: 'address_1',
  },
  address2: {
    allowNull: true,
    type: Sequelize.STRING(100),
    field: 'address_2',
  },
  city: {
    allowNull: true,
    type: Sequelize.STRING(100),
    field: 'city',
  },
  region: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  postalCode: {
    allowNull: true,
    type: Sequelize.STRING(100),
    field: 'postal_code',
  },
  country: {
    allowNull: true,
    type: Sequelize.STRING(100),
  },
  shippingRegionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'shipping_region',
      key: 'shipping_region_id',
    },
    field: 'shipping_region_id',
  },
  dayPhone: {
    allowNull: true,
    type: Sequelize.STRING(100),
    field: 'day_phone',
  },
  evePhone: {
    allowNull: true,
    type: Sequelize.STRING(100),
    field: 'eve_phone',
  },
  mobPhone: {
    allowNull: true,
    type: Sequelize.STRING(100),
    field: 'mob_phone',
  },
  isEnabled: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  isActived: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  language: {
    allowNull: false,
    type: Sequelize.STRING(2),
    defaultValue: 'en',
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.existEmail = email => sequelize
  .query(
    `SELECT COUNT(*) count
    FROM customer WHERE email = :email`,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { email },
    },
  ).then(result => result[0].count > 0);

module.exports = model;
