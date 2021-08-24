-- MariaDB dump 10.19  Distrib 10.5.9-MariaDB, for osx10.16 (x86_64)
--
-- Host: localhost    Database: minecraftmods2
-- ------------------------------------------------------
-- Server version	10.5.9-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mc_addons`
--

DROP TABLE IF EXISTS `mc_addons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mc_addons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filepath` text DEFAULT NULL,
  `folderpath` text DEFAULT NULL,
  `uuid` text DEFAULT NULL,
  `pack_name` text DEFAULT NULL,
  `pack_description` text DEFAULT NULL,
  `pack_type` text DEFAULT NULL,
  `pack_version` text DEFAULT NULL,
  `pack_engine_version` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp(),
  `isPublished` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mc_addons`
--

LOCK TABLES `mc_addons` WRITE;
/*!40000 ALTER TABLE `mc_addons` DISABLE KEYS */;
/*!40000 ALTER TABLE `mc_addons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mc_dependencies`
--

DROP TABLE IF EXISTS `mc_dependencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mc_dependencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `uuid` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mc_dependencies_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mc_dependencies_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mc_dependencies`
--

LOCK TABLES `mc_dependencies` WRITE;
/*!40000 ALTER TABLE `mc_dependencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `mc_dependencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_animation_controllers`
--

DROP TABLE IF EXISTS `mca_animation_controllers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_animation_controllers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_animation_controllers_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_animation_controllers_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=752 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_animation_controllers`
--

LOCK TABLES `mca_animation_controllers` WRITE;
/*!40000 ALTER TABLE `mca_animation_controllers` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_animation_controllers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_animations`
--

DROP TABLE IF EXISTS `mca_animations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_animations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_animations_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_animations_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1387 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_animations`
--

LOCK TABLES `mca_animations` WRITE;
/*!40000 ALTER TABLE `mca_animations` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_animations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_attachables`
--

DROP TABLE IF EXISTS `mca_attachables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_attachables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_attachables_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_attachables_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=567 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_attachables`
--

LOCK TABLES `mca_attachables` WRITE;
/*!40000 ALTER TABLE `mca_attachables` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_attachables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_entities`
--

DROP TABLE IF EXISTS `mca_entities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_entities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_entities_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_entities_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1360 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_entities`
--

LOCK TABLES `mca_entities` WRITE;
/*!40000 ALTER TABLE `mca_entities` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_entities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_entities_rp`
--

DROP TABLE IF EXISTS `mca_entities_rp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_entities_rp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_entities_rp_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_entities_rp_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1618 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_entities_rp`
--

LOCK TABLES `mca_entities_rp` WRITE;
/*!40000 ALTER TABLE `mca_entities_rp` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_entities_rp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_fogs`
--

DROP TABLE IF EXISTS `mca_fogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_fogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_fogs_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_fogs_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=701 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_fogs`
--

LOCK TABLES `mca_fogs` WRITE;
/*!40000 ALTER TABLE `mca_fogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_fogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_items`
--

DROP TABLE IF EXISTS `mca_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_items_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_items_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1450 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_items`
--

LOCK TABLES `mca_items` WRITE;
/*!40000 ALTER TABLE `mca_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_loot_tables`
--

DROP TABLE IF EXISTS `mca_loot_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_loot_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_loot_tables_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_loot_tables_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1893 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_loot_tables`
--

LOCK TABLES `mca_loot_tables` WRITE;
/*!40000 ALTER TABLE `mca_loot_tables` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_loot_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_models`
--

DROP TABLE IF EXISTS `mca_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_models_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_models_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1384 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_models`
--

LOCK TABLES `mca_models` WRITE;
/*!40000 ALTER TABLE `mca_models` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_other`
--

DROP TABLE IF EXISTS `mca_other`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_other` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_other_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_other_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_other`
--

LOCK TABLES `mca_other` WRITE;
/*!40000 ALTER TABLE `mca_other` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_other` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_particles`
--

DROP TABLE IF EXISTS `mca_particles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_particles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_particles_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_particles_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1309 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_particles`
--

LOCK TABLES `mca_particles` WRITE;
/*!40000 ALTER TABLE `mca_particles` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_particles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_recipes`
--

DROP TABLE IF EXISTS `mca_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_recipes_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_recipes_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14606 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_recipes`
--

LOCK TABLES `mca_recipes` WRITE;
/*!40000 ALTER TABLE `mca_recipes` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_render_controllers`
--

DROP TABLE IF EXISTS `mca_render_controllers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_render_controllers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_render_controllers_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_render_controllers_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=996 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_render_controllers`
--

LOCK TABLES `mca_render_controllers` WRITE;
/*!40000 ALTER TABLE `mca_render_controllers` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_render_controllers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_scripts`
--

DROP TABLE IF EXISTS `mca_scripts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_scripts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_scripts_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_scripts_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_scripts`
--

LOCK TABLES `mca_scripts` WRITE;
/*!40000 ALTER TABLE `mca_scripts` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_scripts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_sounds`
--

DROP TABLE IF EXISTS `mca_sounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_sounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_sounds_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_sounds_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_sounds`
--

LOCK TABLES `mca_sounds` WRITE;
/*!40000 ALTER TABLE `mca_sounds` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_sounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_spawn_rules`
--

DROP TABLE IF EXISTS `mca_spawn_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_spawn_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_spawn_rules_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_spawn_rules_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=601 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_spawn_rules`
--

LOCK TABLES `mca_spawn_rules` WRITE;
/*!40000 ALTER TABLE `mca_spawn_rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_spawn_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_texts`
--

DROP TABLE IF EXISTS `mca_texts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_texts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_texts_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_texts_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_texts`
--

LOCK TABLES `mca_texts` WRITE;
/*!40000 ALTER TABLE `mca_texts` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_texts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_textures`
--

DROP TABLE IF EXISTS `mca_textures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_textures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_textures_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_textures_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3083 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_textures`
--

LOCK TABLES `mca_textures` WRITE;
/*!40000 ALTER TABLE `mca_textures` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_textures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_trading`
--

DROP TABLE IF EXISTS `mca_trading`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_trading` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_trading_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_trading_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=331 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_trading`
--

LOCK TABLES `mca_trading` WRITE;
/*!40000 ALTER TABLE `mca_trading` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_trading` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mca_ui`
--

DROP TABLE IF EXISTS `mca_ui`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mca_ui` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mca_id` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filepath` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mca_ui_mca_id_fk_mc_addons_id` (`mca_id`),
  CONSTRAINT `mca_ui_mca_id_fk_mc_addons_id` FOREIGN KEY (`mca_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1884 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mca_ui`
--

LOCK TABLES `mca_ui` WRITE;
/*!40000 ALTER TABLE `mca_ui` DISABLE KEYS */;
/*!40000 ALTER TABLE `mca_ui` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_post_attachments`
--

DROP TABLE IF EXISTS `site_post_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_post_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) DEFAULT NULL,
  `mc_addon_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `site_post_attachments_post_id_fk_site_posts_id` (`post_id`),
  KEY `site_post_attachments_mc_addon_id_fk_mc_addons_id` (`mc_addon_id`),
  CONSTRAINT `site_post_attachments_mc_addon_id_fk_mc_addons_id` FOREIGN KEY (`mc_addon_id`) REFERENCES `mc_addons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `site_post_attachments_post_id_fk_site_posts_id` FOREIGN KEY (`post_id`) REFERENCES `site_posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_post_attachments`
--

LOCK TABLES `site_post_attachments` WRITE;
/*!40000 ALTER TABLE `site_post_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_post_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_posts`
--

DROP TABLE IF EXISTS `site_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_posts`
--

LOCK TABLES `site_posts` WRITE;
/*!40000 ALTER TABLE `site_posts` DISABLE KEYS */;
INSERT INTO `site_posts` VALUES (1,'My first post title','Content here','2021-08-11 16:49:30','2021-08-11 16:49:30'),(2,'Second post','Second content','2021-08-12 16:49:30','2021-08-12 16:49:30'),(3,'post 3','content 3','2021-08-12 17:12:09','2021-08-12 17:10:09'),(4,'post 4','content 4','2021-08-12 17:12:09','2021-08-12 17:11:09'),(5,'post 5','content 5','2021-08-12 17:12:09','2021-08-12 17:12:09');
/*!40000 ALTER TABLE `site_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text DEFAULT NULL,
  `hash` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (20,'tomasci','$2b$10$iZJOpd/RMz4vb0WOsL6Y8.ivXROCR1we7ImnLWVJha4Fe0uF430p6','zivgta@gmail.com','2021-08-21 22:00:30','2021-08-21 22:00:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_outdated_tokens`
--

DROP TABLE IF EXISTS `users_outdated_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_outdated_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` mediumtext DEFAULT NULL,
  `reason` enum('expired','banned','logout') DEFAULT 'expired',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_outdated_tokens`
--

LOCK TABLES `users_outdated_tokens` WRITE;
/*!40000 ALTER TABLE `users_outdated_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_outdated_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-25  2:20:58
