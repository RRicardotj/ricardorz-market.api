module.exports = `
CREATE TABLE IF NOT EXISTS attribute_value (
  attribute_value_id INT          NOT NULL  AUTO_INCREMENT,
  attribute_id       INT          NOT NULL, -- The ID of the attribute
  value              VARCHAR(100) NOT NULL, -- E.g. Yellow
  PRIMARY KEY (attribute_value_id),
  FOREIGN KEY(attribute_id) REFERENCES attribute(attribute_id),
  KEY idx_attribute_value_attribute_id (attribute_id)
)`;
