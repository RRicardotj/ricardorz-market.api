/**
 * WITH THIS PROCESS YOU CAN INITIALIZE THE ECOMMERCE DATABASE
 * IF YOU WANT TO RESET DATABASE YOU MUST DOING MANUALLY BY YOURSELF
 */
// import DB connection with sequelize
const sequelize = require('../common/connection');

// imports models
const Deparment = require('../models/Department');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductAttribute = require('../models/ProductAttribute');
const ProductCategory = require('../models/ProductCategory');
const Attribute = require('../models/Attribute');
const AttributeValue = require('../models/AttributeValue');
const ShippingRegion = require('../models/ShippingRegion');
const Shipping = require('../models/Shipping');
const Tax = require('../models/Tax');

// Create queries
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
  createCart,
} = require('./create_tables');

// Population queries
const {
  deparmentData,
  categoryData,
  productData,
  productCategoryData,
  attributeData,
  attributeValueData,
  productAttributeData,
  shippingRegionData,
  shippingData,
  taxData,
} = require('./populateData');

/**
 * Function for data population
 */
const populateData = async () => {
  // Check if tables has rows if it's not then popule data respectively
  const deparmentHasData = await Deparment.hasData();
  const categoryHasData = await Category.hasData();
  const productHasData = await Product.hasData();
  const productCategoryHasData = await ProductCategory.hasData();
  const attributeHasData = await Attribute.hasData();
  const attributeValueHasData = await AttributeValue.hasData();
  const productAttributeHasData = await ProductAttribute.hasData();
  const shippingRegionHasData = await ShippingRegion.hasData();
  const shippingHasData = await Shipping.hasData();
  const taxHasData = await Tax.hasData();

  if (!deparmentHasData) { await sequelize.query(deparmentData); }

  if (!categoryHasData) { await sequelize.query(categoryData); }

  if (!productHasData) { await sequelize.query(productData); }

  if (!productCategoryHasData) { await sequelize.query(productCategoryData); }

  if (!attributeHasData) { await sequelize.query(attributeData); }

  if (!attributeValueHasData) { await sequelize.query(attributeValueData); }

  if (!productAttributeHasData) { await sequelize.query(productAttributeData); }

  if (!shippingRegionHasData) { await sequelize.query(shippingRegionData); }

  if (!shippingHasData) { await sequelize.query(shippingData); }

  if (!taxHasData) { await sequelize.query(taxData); }

  return undefined;
};

const init = async () => {
  // RUN create tables queries
  await sequelize.query(createDeparments);
  await sequelize.query(createCategory);
  await sequelize.query(createProduct);
  await sequelize.query(createProductCategory);
  await sequelize.query(createAttributes);
  await sequelize.query(createAttributeValue);
  await sequelize.query(createProductAttribute);
  await sequelize.query(createShippingRegion);
  await sequelize.query(createCustomer);
  await sequelize.query(createShipping);
  await sequelize.query(createCart);
  await sequelize.query(createShoppingCart);
  await sequelize.query(createTax);
  await sequelize.query(createOrders);
  await sequelize.query(createOrderDetails);
  await sequelize.query(createAudit);
  await sequelize.query(createReview);

  // Run populate data function
  await populateData();
};

init().then(() => (sequelize.close())).catch((err) => {
  console.log('An error has occurred'); // eslint-disable-line
  console.log(err); // eslint-disable-line
  sequelize.close();
});
