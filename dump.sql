-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: beauty_ecom
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Feedback`
--

DROP TABLE IF EXISTS `Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedback`
--

LOCK TABLES `Feedback` WRITE;
/*!40000 ALTER TABLE `Feedback` DISABLE KEYS */;
INSERT INTO `Feedback` VALUES (1,'sudipta ','sudiptamandal6644@gmail.com','experience was good ','2026-04-02 13:34:16');
/*!40000 ALTER TABLE `Feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `OrderCustomerProducts`
--

DROP TABLE IF EXISTS `OrderCustomerProducts`;
/*!50001 DROP VIEW IF EXISTS `OrderCustomerProducts`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `OrderCustomerProducts` AS SELECT 
 1 AS `order_id`,
 1 AS `ordered_at`,
 1 AS `status`,
 1 AS `order_total`,
 1 AS `user_id`,
 1 AS `user_name`,
 1 AS `user_email`,
 1 AS `user_phone`,
 1 AS `user_address`,
 1 AS `user_city`,
 1 AS `product_id`,
 1 AS `product_name`,
 1 AS `quantity`,
 1 AS `price_at_purchase`,
 1 AS `item_total`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `OrderItems`
--

DROP TABLE IF EXISTS `OrderItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  `item_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItems`
--

LOCK TABLES `OrderItems` WRITE;
/*!40000 ALTER TABLE `OrderItems` DISABLE KEYS */;
INSERT INTO `OrderItems` VALUES (1,12,1,1,'Rose Velvet Serum',38.00,38.00),(2,12,2,1,'Soft Matte Lip Cloud',22.00,22.00),(3,13,1,1,'Rose Velvet Serum',38.00,38.00),(4,13,2,1,'Soft Matte Lip Cloud',22.00,22.00),(5,13,5,1,'Amber Bloom Eau de Parfum',56.00,56.00),(6,14,2,3,'Soft Matte Lip Cloud',22.00,66.00),(7,29,5,1,'Amber Bloom Eau de Parfum',56.00,56.00),(8,29,1,3,'Rose Velvet Serum',38.00,114.00),(9,29,2,2,'Soft Matte Lip Cloud',22.00,44.00),(10,29,3,2,'Silk Repair Hair Mask',28.00,56.00),(11,29,4,1,'Coconut Milk Body Wash',18.00,18.00),(12,29,6,1,'Cloud Finish Compact',26.00,26.00),(13,29,7,1,'mamaearth',78.00,78.00),(14,30,5,1,'Amber Bloom Eau de Parfum',56.00,56.00),(15,30,1,2,'Rose Velvet Serum',38.00,76.00),(16,30,2,2,'Soft Matte Lip Cloud',22.00,44.00),(17,30,3,3,'Silk Repair Hair Mask',28.00,84.00),(18,30,4,1,'Coconut Milk Body Wash',18.00,18.00),(19,30,7,1,'mamaearth',78.00,78.00),(20,30,6,1,'Cloud Finish Compact',26.00,26.00),(21,31,7,1,'mamaearth',78.00,78.00);
/*!40000 ALTER TABLE `OrderItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Processing',
  `total` decimal(10,2) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) NOT NULL,
  `customer_address` text NOT NULL,
  `customer_city` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (12,1,'Processing',60.00,'Sudipta Mandal','sudiptamandal6644@gmail.com','+91 62946-07200','rampurhat, mg rd','Rampurhat ','2026-04-02 13:39:20','2026-04-02 13:39:20'),(13,1,'Processing',116.00,'Sudipta Mandal','sudiptamandal6644@gmail.com','+91 62946-07200','rampurhat, mg rd','Rampurhat ','2026-04-02 13:39:35','2026-04-02 13:39:35'),(14,1,'Processing',66.00,'Sudipta Mandal','sudiptamandal6644@gmail.com','+91 62946-07200','rampurhat, mg rd','Rampurhat ','2026-04-02 13:47:39','2026-04-02 13:47:39'),(29,3,'Processing',392.00,'tuku piya','furmula1@gmail.com','659423011','nogortola','nalhati','2026-04-02 14:47:52','2026-04-02 14:47:52'),(30,2,'Processing',382.00,'Sudipta Mandal','sudiptamandal664@gmail.com','+91 62946-07200','rampurhat, mg rd','Rampurhat ','2026-04-03 06:45:33','2026-04-03 06:45:33'),(31,2,'Processing',78.00,'Sudipta Mandal','sudiptamandal664@gmail.com','+91 62946-07200','rampurhat, mg rd','Rampurhat ','2026-04-03 07:05:34','2026-04-03 07:05:34');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT '4.5',
  `image_path` text NOT NULL,
  `image_path_2` text,
  `image_path_3` text,
  `description` text NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (1,'Rose Velvet Serum','Skincare',38.00,4.8,'/product-images/rose-velvet-serum.svg','/product-images/rose-velvet-serum.svg','/product-images/rose-velvet-serum.svg','A glow-boosting serum with rose extract, niacinamide, and hyaluronic acid.',24),(2,'Soft Matte Lip Cloud','Makeup',22.00,4.7,'/product-images/soft-matte-lip-cloud.svg','/product-images/soft-matte-lip-cloud.svg','/product-images/soft-matte-lip-cloud.svg','Air-whipped lip color with a blurred matte finish and comfortable wear.',43),(3,'Silk Repair Hair Mask','Hair Care',28.00,4.6,'/product-images/silk-repair-hair-mask.svg','/product-images/silk-repair-hair-mask.svg','/product-images/silk-repair-hair-mask.svg','A rich mask that smooths dry ends and restores shine in one treatment.',31),(4,'Coconut Milk Body Wash','Bath & Body',18.00,4.5,'/product-images/coconut-milk-body-wash.svg','/product-images/coconut-milk-body-wash.svg','/product-images/coconut-milk-body-wash.svg','Gentle, creamy cleanser with coconut milk and shea for daily softness.',51),(5,'Amber Bloom Eau de Parfum','Fragrance',56.00,4.9,'/product-images/amber-bloom-eau-de-parfum.svg','/product-images/amber-bloom-eau-de-parfum.svg','/product-images/amber-bloom-eau-de-parfum.svg','A warm floral fragrance with amber, peony, and skin-soft musk.',17),(6,'Cloud Finish Compact','Makeup',26.00,4.4,'/product-images/cloud-finish-compact.svg','/product-images/cloud-finish-compact.svg','/product-images/cloud-finish-compact.svg','Weightless setting powder that smooths pores and controls midday shine.',35),(7,'mamaearth','facewash',78.00,4.5,'/product-images/18498766a.webp','/product-images/cloud-finish-compact.svg',NULL,'fw is good',34);
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reviews`
--

LOCK TABLES `Reviews` WRITE;
/*!40000 ALTER TABLE `Reviews` DISABLE KEYS */;
INSERT INTO `Reviews` VALUES (1,1,'sudiptamandal6644@gmail.com',5,'good best for money\n','2026-04-03 06:53:04');
/*!40000 ALTER TABLE `Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Sudipta Mandal','sudiptamandal6644@gmail.com','+91 62946-07200','rampurhat, mg rd','Rampurhat ','$2a$10$.r7C4fL0Ag0wtG31y67M3ujk2GJ/IKfb1YN4pc42PJJeI1R32rYAK','2026-04-02 13:37:34','2026-04-02 13:37:34'),(2,'Sudipta Mandal','sudiptamandal664@gmail.com','+91 62946-07200','rampurhat, mg rd','Rampurhat ','$2a$10$t63aXkWBjRx/Dh2HlIVqs.u9xzqR5B4PKfJ4tE9AvEfkMbFeOf6Gq','2026-04-02 13:49:36','2026-04-02 13:49:36'),(3,'tuku piya','furmula1@gmail.com','659423011','nogortola','nalhati','$2a$10$f8GTXQEbxdYFJWk6cXFY1.cMAmmQ4w7EviJwqG1E9cUEBviEEqcr6','2026-04-02 14:47:27','2026-04-02 14:47:27');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WholesaleLeads`
--

DROP TABLE IF EXISTS `WholesaleLeads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WholesaleLeads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WholesaleLeads`
--

LOCK TABLES `WholesaleLeads` WRITE;
/*!40000 ALTER TABLE `WholesaleLeads` DISABLE KEYS */;
INSERT INTO `WholesaleLeads` VALUES (1,'Sudipta Mandal','sudiptamandal6644@gmail.com','+91 62946-07200','mg-road taksala','2026-04-02 13:41:23'),(2,'Sudipta Mandal','sudiptamandal6644@gmail.com','+91 62946-07200','mg-road taksala','2026-04-02 13:44:19');
/*!40000 ALTER TABLE `WholesaleLeads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `OrderCustomerProducts`
--

/*!50001 DROP VIEW IF EXISTS `OrderCustomerProducts`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `OrderCustomerProducts` AS select `o`.`id` AS `order_id`,`o`.`created_at` AS `ordered_at`,`o`.`status` AS `status`,`o`.`total` AS `order_total`,`u`.`id` AS `user_id`,`u`.`name` AS `user_name`,`u`.`email` AS `user_email`,`u`.`phone` AS `user_phone`,`u`.`address` AS `user_address`,`u`.`city` AS `user_city`,`oi`.`product_id` AS `product_id`,`oi`.`product_name` AS `product_name`,`oi`.`quantity` AS `quantity`,`oi`.`price_at_purchase` AS `price_at_purchase`,`oi`.`item_total` AS `item_total` from ((`Orders` `o` join `Users` `u` on((`u`.`id` = `o`.`user_id`))) join `OrderItems` `oi` on((`oi`.`order_id` = `o`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-12  4:07:08
