const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'shipping_region';

const fields = {
  shippingRegionId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    field: 'shipping_region_id',
  },
  shippingRegion: {
    allowNull: false,
    type: Sequelize.STRING(100),
    field: 'shipping_region',
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM shipping_region',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

model.shippingRegionExist = shippingRegionId => sequelize
  .query(
    'SELECT COUNT(*) count FROM shipping_region WHERE shipping_region_id =:shippingRegionId',
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { shippingRegionId },
    },
  ).then(result => result[0].count > 0);

module.exports = model;
