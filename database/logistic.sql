-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2018 at 08:03 AM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `logistic`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignment`
--

CREATE TABLE `assignment` (
  `id` int(5) NOT NULL,
  `courier_id` int(6) NOT NULL,
  `package` text NOT NULL,
  `date_received` datetime NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `courier`
--

CREATE TABLE `courier` (
  `id` int(6) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courier`
--

INSERT INTO `courier` (`id`, `first_name`, `last_name`) VALUES
(1, 'Sample', 'Name'),
(2, 'Second', 'Sample');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(6) NOT NULL,
  `item` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `date_received` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `item`, `category`, `date_received`) VALUES
(1, 'Sample Item 1', '', '2018-04-02 12:29:45'),
(2, 'item 2', '', '2018-04-02 12:49:24'),
(3, 'Sample Item 3', '', '2018-04-02 13:27:06'),
(4, 'Sample Item 4', '', '2018-04-02 13:27:14'),
(5, 'Sample Item 5', '', '2018-04-02 13:27:20'),
(6, 'Sample Item 6', '', '2018-04-02 13:27:25');

-- --------------------------------------------------------

--
-- Table structure for table `temp_assignment`
--

CREATE TABLE `temp_assignment` (
  `id` int(6) NOT NULL,
  `courier_id` int(6) NOT NULL,
  `courier_name` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `location` varchar(250) NOT NULL,
  `area` varchar(255) NOT NULL,
  `tracking_num` varchar(10) NOT NULL,
  `date_received` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `temp_assignment`
--

INSERT INTO `temp_assignment` (`id`, `courier_id`, `courier_name`, `status`, `item_name`, `location`, `area`, `tracking_num`, `date_received`) VALUES
(9, 2, 'Second Sample', 'RECEIVED', 'Sample Item 6', 'Pasig', '', 'Y4iI95V5wk', '2018-04-03 11:30:21'),
(10, 2, 'Second Sample', 'RECEIVED', 'Sample Item 1', 'Pasig', '', 'D1gmUbKu1S', '2018-04-03 11:35:45'),
(11, 2, 'Second Sample', 'RECEIVED', 'Sample Item 3', 'Pasig', '', 'D0mGyPt0xX', '2018-04-03 11:36:02'),
(12, 1, 'Sample Name', 'RECEIVED', 'Sample Item 4', 'Pasig', '', 'RhnUXtugfV', '2018-04-03 11:36:29'),
(13, 1, 'Sample Name', 'RECEIVED', 'Sample Item 5', 'Pasig', '', 'HvMpFztAZb', '2018-04-03 11:37:02'),
(14, 1, 'Sample Name', 'RECEIVED', 'Sample Item 6', 'Pasig', '', 'Ic0cajs8tW', '2018-04-03 11:38:16'),
(15, 2, 'Second Sample', 'FOR_INBOUND', 'Sample Item 6', 'Pasig', '', '7xLRhAye6I', '2018-04-03 11:40:27'),
(16, 2, 'Second Sample', 'FOR_INBOUND', 'Sample Item 5', 'Pasig', '', 'K2enqHf9Rp', '2018-04-03 11:40:39'),
(17, 2, 'Second Sample', 'FOR_INBOUND', 'Sample Item 5', 'Pasig', '', 'uvDL31GTuw', '2018-04-03 13:32:12'),
(18, 1, 'Sample Name', 'FOR_INBOUND', 'Sample Item 1', 'Pasig', '', 'e8CgKpuRtp', '2018-04-03 13:53:01'),
(19, 1, 'Sample Name', 'FOR_INBOUND', 'item 2', 'Pasig', '', 'a2Un1aHoXb', '2018-04-03 13:53:07'),
(20, 1, 'Sample Name', 'FOR_INBOUND', 'Sample Item 3', 'Pasig', '', 'KNYJ7hC5zA', '2018-04-03 13:53:15'),
(21, 1, 'Sample Name', 'FOR_INBOUND', 'Sample Item 4', 'Pasig', '', '8RFr5Ptsnt', '2018-04-03 13:53:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(6) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT NULL,
  `deleted` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `first_name`, `last_name`, `date_created`, `date_updated`, `deleted`) VALUES
(1, 'maangelo', '*034182A557A41EEC5F1F71A34342748428405ADF', 'Mark Angelo', 'Atienza', '2018-04-02 03:46:43', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courier`
--
ALTER TABLE `courier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `temp_assignment`
--
ALTER TABLE `temp_assignment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courier`
--
ALTER TABLE `courier`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `temp_assignment`
--
ALTER TABLE `temp_assignment`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
