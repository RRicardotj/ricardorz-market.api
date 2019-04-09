const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'product_attribute';

const fields = {
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'product',
      key: 'product_id',
    },
    field: 'product_id',
  },
  attributeValueId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'attribute_value',
      key: 'attribute_value_id',
    },
    field: 'attribute_value_id',
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM product_attribute',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
