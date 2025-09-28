-- --------------------------------------------------------
-- Host:                         sql12.freesqldatabase.com
-- Server version:               5.5.62-0ubuntu0.14.04.1 - (Ubuntu)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table sql12799345.hourly_summary
CREATE TABLE IF NOT EXISTS `hourly_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  `avg_energy_active` float DEFAULT NULL,
  `avg_energy_reactive` float DEFAULT NULL,
  `avg_total_power_factor` float DEFAULT NULL,
  `avg_power_active_total` float DEFAULT NULL,
  `avg_power_reactive_total` float DEFAULT NULL,
  `avg_power_apparent_total` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `start_time` (`start_time`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table sql12799345.raw_sensor_data
CREATE TABLE IF NOT EXISTS `raw_sensor_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `energy_active` float DEFAULT NULL,
  `energy_reactive` float DEFAULT NULL,
  `total_power_factor` float DEFAULT NULL,
  `power_active_total` float DEFAULT NULL,
  `power_reactive_total` float DEFAULT NULL,
  `power_apparent_total` float DEFAULT NULL,
  `voltage_r` float DEFAULT NULL,
  `current_r` float DEFAULT NULL,
  `power_active_r` float DEFAULT NULL,
  `power_reactive_r` float DEFAULT NULL,
  `power_apparent_r` float DEFAULT NULL,
  `power_factor_r` float DEFAULT NULL,
  `voltage_s` float DEFAULT NULL,
  `current_s` float DEFAULT NULL,
  `power_active_s` float DEFAULT NULL,
  `power_reactive_s` float DEFAULT NULL,
  `power_apparent_s` float DEFAULT NULL,
  `power_factor_s` float DEFAULT NULL,
  `voltage_t` float DEFAULT NULL,
  `current_t` float DEFAULT NULL,
  `power_active_t` float DEFAULT NULL,
  `power_reactive_t` float DEFAULT NULL,
  `power_apparent_t` float DEFAULT NULL,
  `power_factor_t` float DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2198 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table sql12799345.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
