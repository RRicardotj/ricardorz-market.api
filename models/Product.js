const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'product';

const fields = {
  product_id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING(1000),
  },
  price: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
  },
  discounted_price: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
    defaultValue: '0.00',
  },
  image: {
    allowNull: true,
    type: Sequelize.STRING(150),
  },
  image_2: {
    allowNull: true,
    type: Sequelize.STRING(150),
  },
  thumbnail: {
    allowNull: true,
    type: Sequelize.STRING(150),
  },
  display: {
    allowNull: false,
    type: Sequelize.INTEGER(6),
    defaultValue: 0,
  },
};

const model = sequelize.define(TABLE_NAME, fields, { freezeTableName: true, timestamps: false });

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM product',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
