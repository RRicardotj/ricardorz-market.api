const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'shipping';

const fields = {
  shipping_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  shipping_type: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
  shipping_cost: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
  },
  shipping_region_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'shipping_region',
      key: 'shipping_region_id',
    },
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
