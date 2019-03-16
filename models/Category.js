const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'category';

const fields = {
  category_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  department_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'department',
      key: 'department_id',
    },
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING(1000),
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM category',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
