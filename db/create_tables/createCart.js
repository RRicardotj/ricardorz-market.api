module.exports = `
CREATE TABLE IF NOT EXISTS cart (
  cart_id   INT            NOT NULL  AUTO_INCREMENT,
  customer_id INT            NULL,
  created_at    DATETIME      NOT NULL,
  isEnabled     BOOL          NOT NULL  DEFAULT true,
  PRIMARY KEY (cart_id),
  FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
)`;
