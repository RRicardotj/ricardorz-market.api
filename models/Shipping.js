const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'shipping';

const fields = {
  shippingId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    field: 'shipping_id',
  },
  shippingType: {
    allowNull: false,
    type: Sequelize.STRING(100),
    field: 'shipping_type',
  },
  shippingCost: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
    field: 'shipping_cost',
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
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM shipping',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
