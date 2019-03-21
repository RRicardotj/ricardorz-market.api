const Sequelize = require('sequelize');
const sequelize = require('../common/connection');
const Category = require('./Category');

const TABLE_NAME = 'department';

const fields = {
  departmentId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
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
    'SELECT COUNT(*) count FROM department',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

model.countDepartment = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM department',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count);

model.hasMany(Category, { as: 'categories', foreignKey: 'department_id' });

module.exports = model;
