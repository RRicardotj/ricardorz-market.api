const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'shipping_region';

const fields = {
  shipping_region_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  shipping_region: {
    allowNull: false,
    type: Sequelize.STRING(100),
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

module.exports = model;
