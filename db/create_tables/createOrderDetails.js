module.exports = `
CREATE TABLE IF NOT EXISTS order_detail (
  item_id      INT           NOT NULL  AUTO_INCREMENT,
  order_id     INT           NOT NULL,
  product_id   INT           NOT NULL,
  attributes   VARCHAR(1000) NOT NULL,
  product_name VARCHAR(100)  NOT NULL,
  quantity     INT           NOT NULL,
  unit_cost    DECIMAL(10,2) NOT NULL,
  PRIMARY KEY  (item_id),
  FOREIGN KEY(order_id) REFERENCES orders(order_id),
  FOREIGN KEY(product_id) REFERENCES product(product_id),
  KEY idx_order_detail_order_id (order_id)
)`;
