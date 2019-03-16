const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'product_category';

const fields = {
  id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'product_id',
    },
  },
  department_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'department',
      key: 'department_id',
    },
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM product_category',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
