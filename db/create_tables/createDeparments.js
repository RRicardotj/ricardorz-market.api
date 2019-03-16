module.exports = `CREATE TABLE IF NOT EXISTS department (
  department_id INT            NOT NULL  AUTO_INCREMENT,
  name          VARCHAR(100)   NOT NULL,
  description   VARCHAR(1000),
  PRIMARY KEY  (department_id)
)`;
