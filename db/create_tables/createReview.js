module.exports = `
  CREATE TABLE IF NOT EXISTS review (
  review_id   INT      NOT NULL  AUTO_INCREMENT,
  customer_id INT      NOT NULL,
  product_id  INT      NOT NULL,
  review      TEXT     NOT NULL,
  rating      SMALLINT NOT NULL,
  created_on  DATETIME NOT NULL,
  PRIMARY KEY (review_id),
  FOREIGN KEY(product_id) REFERENCES product(product_id),
  FOREIGN KEY(customer_id) REFERENCES customer(customer_id),
  KEY idx_review_customer_id (customer_id),
  KEY idx_review_product_id (product_id)
)`;
