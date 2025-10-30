-- ==============================================
-- 🚨 DROP AND RECREATE DATABASE
-- ==============================================
DROP DATABASE IF EXISTS farmer;
CREATE DATABASE farmer;
USE farmer;

-- ==============================================
-- FARMER TABLE
-- ==============================================
CREATE TABLE farmer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- VOLUNTEER TABLE
-- ==============================================
CREATE TABLE volunteer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- CONSUMER TABLE
-- ==============================================
CREATE TABLE consumer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(100),
  contact VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- PRODUCTS TABLE
-- ==============================================
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  totalQuantity INT NOT NULL DEFAULT 0,
  pricePerKg DECIMAL(10,2) NOT NULL,
  harvestDate DATE NOT NULL,
  farmName VARCHAR(100) DEFAULT '-',
  location VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  farmerId INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmerId) REFERENCES farmer(id) ON DELETE CASCADE
);

-- ==============================================
-- ORDERS TABLE (✅ FIXED deliveryAssigned)
-- ==============================================
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consumerId INT NOT NULL,
  totalRate DECIMAL(10,2) NOT NULL,
  orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deliveryAssigned INT DEFAULT NULL,
  delivered BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (consumerId) REFERENCES consumer(id) ON DELETE CASCADE,
  FOREIGN KEY (deliveryAssigned) REFERENCES volunteer(id) ON DELETE SET NULL
);

-- ==============================================
-- ORDER ITEMS TABLE
-- ==============================================
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  pricePerKg DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ==============================================
-- ✅ CHECK STRUCTURE
-- ==============================================
SHOW TABLES;
