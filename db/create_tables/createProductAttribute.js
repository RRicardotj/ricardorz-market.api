module.exports = `
CREATE TABLE IF NOT EXISTS product_attribute (
  id INT          NOT NULL  AUTO_INCREMENT,
  product_id         INT NOT NULL,
  attribute_value_id INT NOT NULL,
  PRIMARY KEY (product_id, attribute_value_id)
)`;
