const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'category';

const fields = {
  categoryId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    field: 'category_id',
  },
  departmentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'department',
      key: 'department_id',
    },
    field: 'department_id',
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(100),
    field: 'name',
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING(1000),
    field: 'description',
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
