const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'tax';

const fields = {
  tax_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  tax_type: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
  tax_percentage: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM tax',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
