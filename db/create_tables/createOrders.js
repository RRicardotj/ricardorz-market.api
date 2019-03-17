module.exports = `
CREATE TABLE IF NOT EXISTS orders (
  order_id     INT           NOT NULL  AUTO_INCREMENT,
  total_amount DECIMAL(10,2) NOT NULL  DEFAULT '0.00',
  created_on   DATETIME      NOT NULL,
  shipped_on   DATETIME,
  status       INT           NOT NULL  DEFAULT '0',
  comments     VARCHAR(255),
  customer_id  INT,
  auth_code    VARCHAR(50),
  reference    VARCHAR(50),
  shipping_id  INT,
  tax_id       INT,
  PRIMARY KEY  (order_id),
  KEY idx_orders_customer_id (customer_id),
  KEY idx_orders_shipping_id (shipping_id),
  FOREIGN KEY(customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY(shipping_id) REFERENCES shipping(shipping_id),
  FOREIGN KEY(tax_id) REFERENCES tax(tax_id),
  KEY idx_orders_tax_id (tax_id)
)`;
