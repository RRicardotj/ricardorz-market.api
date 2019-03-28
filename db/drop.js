/**
 * WITH THIS PROCESS YOU CAN DROP THE ECOMMERCE TABLES
 */
// import DB connection with sequelize
const sequelize = require('../common/connection');


// drop queries
const {
  dropAttributes,
  dropAttributeValue,
  dropAudit,
  dropCart,
  dropCategory,
  dropCustomer,
  dropDepartment,
  dropOrderDetail,
  dropOrders,
  dropProduct,
  dropProductAttribute,
  dropProductCategory,
  dropReview,
  dropShipping,
  dropShippingRegion,
  dropShoppingCart,
  dropTax,
} = require('./drop_tables');


const drop = async () => {
  // RUN drop tables queries
  await sequelize.query(dropReview);
  await sequelize.query(dropAudit);
  await sequelize.query(dropOrderDetail);
  await sequelize.query(dropOrders);
  await sequelize.query(dropTax);
  await sequelize.query(dropShoppingCart);
  await sequelize.query(dropCart);
  await sequelize.query(dropShipping);
  await sequelize.query(dropCustomer);
  await sequelize.query(dropShippingRegion);
  await sequelize.query(dropProductAttribute);
  await sequelize.query(dropAttributeValue);
  await sequelize.query(dropAttributes);
  await sequelize.query(dropProductCategory);
  await sequelize.query(dropProduct);
  await sequelize.query(dropCategory);
  await sequelize.query(dropDepartment);
};

drop().then(() => (sequelize.close())).catch((err) => {
  console.log('An error has occurred'); // eslint-disable-line
  console.log(err); // eslint-disable-line
  sequelize.close();
});
