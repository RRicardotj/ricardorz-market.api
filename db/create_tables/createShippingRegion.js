module.exports = `
CREATE TABLE IF NOT EXISTS shipping_region (
  shipping_region_id INT          NOT NULL  AUTO_INCREMENT,
  shipping_region    VARCHAR(100) NOT NULL,
  PRIMARY KEY  (shipping_region_id)
)`;
