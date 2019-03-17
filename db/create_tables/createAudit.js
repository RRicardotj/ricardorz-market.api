module.exports = `
CREATE TABLE IF NOT EXISTS audit (
  audit_id       INT      NOT NULL AUTO_INCREMENT,
  order_id       INT      NOT NULL,
  created_on     DATETIME NOT NULL,
  message        TEXT     NOT NULL,
  code           INT      NOT NULL,
  PRIMARY KEY (audit_id),
  FOREIGN KEY(order_id) REFERENCES orders(order_id),
  KEY idx_audit_order_id (order_id)
)`;
