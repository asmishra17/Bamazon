DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  stock_quantity INTEGER(3) NOT NULL, 
  PRIMARY KEY (item_id)
)

