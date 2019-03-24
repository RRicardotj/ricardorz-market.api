const Sequelize = require('sequelize');
const sequelize = require('../common/connection');

const TABLE_NAME = 'category';
const domain = `"${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/"`;

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

const foundRows = () => sequelize
  .query('SELECT FOUND_ROWS() total', { type: sequelize.QueryTypes.SELECT });

model.getAllProductsById = (id, page) => {
  const offset = (page - 1) * 10;
  return sequelize
    .query(
      `SELECT SQL_CALC_FOUND_ROWS prod.product_id productId, prod.name, prod.description, prod.price, prod.discounted_price discountedPrice,
      CONCAT(${domain}, '', prod.image) image, CONCAT(${domain}, '', prod.image_2) image2,
      CONCAT(${domain}, '', prod.thumbnail) thumbnail,
        (SELECT name FROM department WHERE department_id = cat.department_id) departmentName,
      cat.name categoryName, cat.category_id categoryId
      FROM category cat
      LEFT JOIN product_category prodCat ON prodCat.category_id = cat.category_id
      LEFT JOIN product prod ON prod.product_id = prodCat.product_id
      ${id ? 'WHERE cat.category_id = :id' : ''}
      LIMIT 10 OFFSET :offset`,
      {
        replacements: { id, offset },
        type: sequelize.QueryTypes.SELECT,
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

model.hasData = () => sequelize
  .query(
    'SELECT COUNT(*) count FROM category',
    {
      type: sequelize.QueryTypes.SELECT,
    },
  ).then(result => result[0].count > 0);

module.exports = model;
