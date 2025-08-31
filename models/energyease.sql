-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
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


-- Dumping database structure for energyease
DROP DATABASE IF EXISTS `energyease`;
CREATE DATABASE IF NOT EXISTS `energyease` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `energyease`;

-- Dumping structure for table energyease.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabel untuk menyimpan data mentah yang datang setiap 10 detik
-- Tambahkan kolom `timestamp` untuk merekam waktu data diterima
CREATE TABLE IF NOT EXISTS `raw_sensor_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `energy_active` FLOAT,
  `energy_reactive` FLOAT,
  `total_power_factor` FLOAT,
  `power_active_total` FLOAT,
  `power_reactive_total` FLOAT,
  `power_apparent_total` FLOAT,

  `voltage_r` FLOAT,
  `current_r` FLOAT,
  `power_active_r` FLOAT,
  `power_reactive_r` FLOAT,
  `power_apparent_r` FLOAT,
  `power_factor_r` FLOAT,

  `voltage_s` FLOAT,
  `current_s` FLOAT,
  `power_active_s` FLOAT,
  `power_reactive_s` FLOAT,
  `power_apparent_s` FLOAT,
  `power_factor_s` FLOAT,
  
  `voltage_t` FLOAT,
  `current_t` FLOAT,
  `power_active_t` FLOAT,
  `power_reactive_t` FLOAT,
  `power_apparent_t` FLOAT,
  `power_factor_t` FLOAT,

  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan data agregasi per jam
CREATE TABLE IF NOT EXISTS `hourly_summary` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `start_time` DATETIME NOT NULL UNIQUE,
  `avg_energy_active` FLOAT,
  `avg_energy_reactive` FLOAT,
  `avg_total_power_factor` FLOAT,
  `avg_power_active_total` FLOAT,
  `avg_power_reactive_total` FLOAT,
  `avg_power_apparent_total` FLOAT
);