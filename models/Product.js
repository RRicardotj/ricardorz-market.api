const moment = require('moment');

const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

// const Order = require('./Order');

const TABLE_NAME = 'product';
const domain = `"${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/"`;

const fields = {
  productId: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    field: 'product_id',
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
  discountedPrice: {
    allowNull: false,
    type: Sequelize.DECIMAL(10, 2),
    defaultValue: '0.00',
    field: 'discounted_price',
  },
  image: {
    allowNull: true,
    type: Sequelize.STRING(150),
  },
  image2: {
    allowNull: true,
    type: Sequelize.STRING(150),
    field: 'image_2',
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

model.productsForMainScene = async () => {
  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const productOrderedAtMonth = await sequelize
    .query(
      `SELECT prod.product_id productId, prod.name, prod.description, prod.price, prod.discounted_price discountedPrice,
      CONCAT(${domain}, '', prod.image) image, CONCAT(${domain}, '', prod.image_2) image2,
      CONCAT(${domain}, '', prod.thumbnail) thumbnail
      FROM orders ord
      LEFT JOIN order_detail ordD ON ordD.order_id = ord.order_id
      LEFT JOIN product prod ON prod.product_id = ordD.product_id
      WHERE prod.display > 0 AND ord.created_on BETWEEN :startOfMonth AND :endOfMonth
      LIMIT 9`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { startOfMonth, endOfMonth },
      },
    );

  if (productOrderedAtMonth.length >= 9) {
    return productOrderedAtMonth;
  }

  const diff = 9 - productOrderedAtMonth.length;

  const products = await sequelize
    .query(
      `SELECT prod.product_id productId, prod.name, prod.description, prod.price, prod.discounted_price discountedPrice,
      CONCAT(${domain}, '', prod.image) image, CONCAT(${domain}, '', prod.image_2) image2,
      CONCAT(${domain}, '', prod.thumbnail) thumbnail
      FROM product prod
      WHERE prod.display > 0
      ORDER BY RAND()
      LIMIT ${diff}`,
      {
        type: sequelize.QueryTypes.SELECT,
      },
    );

  const productsToReturn = [...productOrderedAtMonth, ...products];

  return productsToReturn;
};

const foundRows = () => sequelize
  .query('SELECT FOUND_ROWS() total', { type: sequelize.QueryTypes.SELECT });

model.searchByName = (name, page) => {
  const offset = (page - 1) * 10;
  return sequelize
    .query(
      `SELECT DISTINCT SQL_CALC_FOUND_ROWS prod.product_id productId, prod.name, prod.description, prod.price, prod.discounted_price discountedPrice,
      CONCAT(${domain}, '', prod.image) image, CONCAT(${domain}, '', prod.image_2) image2,
      CONCAT(${domain}, '', prod.thumbnail) thumbnail
      FROM product prod
      ${name ? `
        LEFT JOIN product_category pc ON pc.product_id = prod.product_id
        LEFT JOIN category cat ON cat.category_id = pc.category_id` : ''}
      ${name ? `
      WHERE
        prod.name COLLATE UTF8_GENERAL_CI LIKE '%${name}%' OR prod.description COLLATE UTF8_GENERAL_CI LIKE '%${name}%'
        OR cat.name COLLATE UTF8_GENERAL_CI LIKE '%${name}%' OR cat.description COLLATE UTF8_GENERAL_CI LIKE '%${name}%'
      ` : ''}
      LIMIT 10 OFFSET :offset`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { name, offset },
      },
    ).then(async (rows) => {
      const total = await foundRows();
      const elements = total[0].total;
      let totalPages = Math.ceil(elements / 10);

      totalPages = (totalPages === 0 ? 1 : totalPages);

      return {
        rows, page: Number(page), totalPages, total: elements,
      };
    });
};

model.getAttributesAvailable = (productId, attributeType) => sequelize
  .query(
    `SELECT prod.product_id productId, attV.value, attV.attribute_value_id attributeValueId
    FROM product prod
    LEFT JOIN product_attribute prodAtt ON prodAtt.product_id = prod.product_id
    LEFT JOIN attribute_value attV ON attV.attribute_value_id = prodAtt.attribute_value_id
    LEFT JOIN attribute att ON att.attribute_id = attV.attribute_id
    WHERE att.name = :attributeType AND prodAtt.product_id = :productId`,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { attributeType, productId },
    },
  );

module.exports = model;
