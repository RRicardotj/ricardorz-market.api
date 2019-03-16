module.exports = `
CREATE TABLE IF NOT EXISTS product_category (
  product_id  INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id)
)`;
