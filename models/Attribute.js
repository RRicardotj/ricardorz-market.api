const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'attribute';

const fields = {
  attribute_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM attribute',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
