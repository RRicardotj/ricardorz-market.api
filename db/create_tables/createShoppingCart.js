module.exports = `
CREATE TABLE IF NOT EXISTS shopping_cart (
  item_id     INT           NOT NULL  AUTO_INCREMENT,
  cart_id     INT      NOT NULL,
  product_id  INT           NOT NULL,
  attributes  VARCHAR(1000) NOT NULL,
  quantity    INT           NOT NULL  DEFAULT '1',
  buy_now     BOOL          NOT NULL  DEFAULT true,
  added_on    DATETIME      NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY(cart_id) REFERENCES cart(cart_id),
  FOREIGN KEY(product_id) REFERENCES product(product_id),
  KEY idx_shopping_cart_cart_id (cart_id)
)`;
