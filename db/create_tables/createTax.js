module.exports = `
CREATE TABLE IF NOT EXISTS tax (
  tax_id         INT            NOT NULL  AUTO_INCREMENT,
  tax_type       VARCHAR(100)   NOT NULL,
  tax_percentage NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (tax_id)
)`;
