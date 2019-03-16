module.exports = `
CREATE TABLE IF NOT EXISTS attribute (
  attribute_id INT          NOT NULL  AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  PRIMARY KEY (attribute_id)
)`;
