const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'attribute_value';

const fields = {
  attribute_value_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  attribute_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'attribute',
      key: 'attribute_id',
    },
  },
  value: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM attribute_value',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
