module.exports = `
CREATE TABLE IF NOT EXISTS product_category (
  product_id  INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY(product_id) REFERENCES product(product_id),
  FOREIGN KEY(category_id) REFERENCES category(category_id)
)`;
