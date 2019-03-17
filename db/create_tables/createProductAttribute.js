module.exports = `
CREATE TABLE IF NOT EXISTS product_attribute (
  product_id         INT NOT NULL,
  attribute_value_id INT NOT NULL,
  PRIMARY KEY (product_id, attribute_value_id),
  FOREIGN KEY(product_id) REFERENCES product(product_id),
  FOREIGN KEY(attribute_value_id) REFERENCES attribute_value(attribute_value_id)
)`;
