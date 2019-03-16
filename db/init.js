/**
 * WITH THIS PROCESS YOU CAN INITIALIZE THE ECOMMERCE DATABASE
 * IF YOU WANT TO RESET DATABASE YOU MUST DOING MANUALLY BY YOURSELF
 */
// import DB connection with sequelize
const sequelize = require('../common/connection');

const {
  createAttributeValue,
  createAttributes,
  createAudit,
  createCategory,
  createCustomer,
  createDeparments,
  createOrderDetails,
  createOrders,
  createProduct,
  createProductAttribute,
  createProductCategory,
  createReview,
  createShipping,
  createShippingRegion,
  createShoppingCart,
  createTax,
} = require('./create_tables');

const init = async () => {
  await sequelize.query(createDeparments);
  await sequelize.query(createCategory);
  await sequelize.query(createProduct);
  await sequelize.query(createProductCategory);
  await sequelize.query(createAttributes);
  await sequelize.query(createAttributeValue);
  await sequelize.query(createProductAttribute);
  await sequelize.query(createShoppingCart);
  await sequelize.query(createOrders);
  await sequelize.query(createOrderDetails);
  await sequelize.query(createShippingRegion);
  await sequelize.query(createCustomer);
  await sequelize.query(createShipping);
  await sequelize.query(createTax);
  await sequelize.query(createAudit);
  await sequelize.query(createReview);
};

init();
