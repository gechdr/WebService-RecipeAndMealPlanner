-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2023 at 02:54 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `t3_6958`
--
CREATE DATABASE IF NOT EXISTS `t3_6958` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `t3_6958`;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` varchar(6) NOT NULL,
  `user_id` varchar(14) NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `recipe_id`, `user_id`, `content`) VALUES
(9, 'REC001', 'USR08032001001', 'Looks delicius'),
(10, 'REC001', 'USR08032004001', 'I can\'t eat chocolate'),
(11, 'REC002', 'USR08032004001', 'chocolate alternative'),
(12, 'REC002', 'USR08032001001', 'yummy');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
CREATE TABLE IF NOT EXISTS `ratings` (
  `rating_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` varchar(6) NOT NULL,
  `user_id` varchar(14) NOT NULL,
  `rating` varchar(1) NOT NULL,
  PRIMARY KEY (`rating_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`rating_id`, `recipe_id`, `user_id`, `rating`) VALUES
(2, 'REC001', 'USR08032001001', '5'),
(3, 'REC002', 'USR08032001001', '4'),
(4, 'REC001', 'USR08032004001', '3'),
(5, 'REC002', 'USR08032004001', '3');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
CREATE TABLE IF NOT EXISTS `recipes` (
  `recipe_id` varchar(6) NOT NULL,
  `user_id` varchar(14) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `ingredients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`ingredients`)),
  `steps` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`steps`)),
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id`, `name`, `description`, `ingredients`, `steps`) VALUES
('REC001', 'USR08031996001', 'Chocolate Granola', 'The only thing that could make it better is chocolate. And not just bits of the good stuff--we\'re talking a full-on takeover.', '[{\"name\":\"Neutral oil\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"Unsalted butter\",\"qty\":2,\"uom\":\"tablespoons\"},{\"name\":\"brown sugar\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"honey\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"pure vanilla extract\",\"qty\":1,\"uom\":\"tablespoons\"},{\"name\":\"cocoa powder\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"salt\",\"qty\":1,\"uom\":\"tablespoons\"},{\"name\":\"oats\",\"qty\":4,\"uom\":\"cups\"},{\"name\":\"chopped almonds\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"chocolate chunks\",\"qty\":2,\"uom\":\"cups\"}]', '[\"Preheat the oven to 325°F. Line two baking sheets with parchment paper, and grease the paper with nonstick cooking spray.\",\"In a medium pot set over low heat, combine the oil with the butter, brown sugar, honey, vanilla, cocoa powder and salt. Heat, stirring occasionally, until the mixture is smooth and fully combined.\",\"In a large bowl, toss the oats with the almonds. Add the cocoa mixture and toss to combine.\",\"Divide the mixture evenly between the two baking sheets and spread into an even layer. Bake until toasty and crisp, 45 minutes to 1 hour. Remove the baking sheets from the oven every 20 minutes or so and toss the granola with a spatula to make sure it’s toasting evenly.\",\"Let cool to room temperature and then stir in the chocolate chunks. Transfer the finished granola to airtight containers; it will keep for up toa week.\"]'),
('REC002', 'USR08032000001', 'Cherry-Almond Granola Bars', 'Toast up some oats, add a drizzle of honey, a spoonful of almond butter and a handful of your favorite mix-ins, and you’ve got your own granola bars in less than 30 minutes.', '[{\"name\":\"Unsalted butter\",\"qty\":1,\"uom\":\"tablespoons\"},{\"name\":\"quick oats\",\"qty\":3,\"uom\":\"cups\"},{\"name\":\"chopped almonds\",\"qty\":2,\"uom\":\"cups\"},{\"name\":\"dried cherries\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"brown sugar\",\"qty\":3,\"uom\":\"tablespoons\"},{\"name\":\"honey\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"almond butter\",\"qty\":1,\"uom\":\"cups\"},{\"name\":\"vanilla extract\",\"qty\":1,\"uom\":\"teaspoons\"}]', '[\"Line a 9-by-13-inch baking pan with parchment paper, leaving an overhang on both sides.\",\"Melt the butter in a large sauté pan over medium heat. Add the oats and toast until fragrant, 1 to 2 minutes.\",\"In a large bowl, combine the oats with the remaining ingredients and mix well to combine. (This can be done by hand, but it’s especially quick in the bowl of an electric mixer fitted with the paddle attachment.)\",\"Press the oat mixture evenly into the prepared pan. Pop the pan into the refrigerator or freezer to let the mixture set for 5 to 10 minutes. Cut into 12 evenly sized bars and serve. The bars will keep in an airtight container or wrapped in plastic for up to five days.\"]');

-- --------------------------------------------------------

--
-- Table structure for table `restrictions`
--

DROP TABLE IF EXISTS `restrictions`;
CREATE TABLE IF NOT EXISTS `restrictions` (
  `restriction_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(14) NOT NULL,
  `restriction` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`restriction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `restrictions`
--

INSERT INTO `restrictions` (`restriction_id`, `user_id`, `restriction`) VALUES
(3, 'USR08031996001', 'peanut'),
(4, 'USR08031996001', 'blueberry'),
(5, 'USR08032004001', 'chocolate');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(14) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dob` varchar(10) NOT NULL,
  `gender` varchar(1) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `dob`, `gender`) VALUES
('USR08031996001', 'Robert Carlyle', 'robert@gmail.com', '19/09/1996', 'L'),
('USR08032000001', 'Charlize Theron', 'charlize@gmail.com', '16/10/2000', 'L'),
('USR08032001001', 'Emmy Rossum', 'emmy@gmail.com', '06/12/2001', 'P'),
('USR08032004001', 'Michelle Fairley', 'michelle@gmail.com', '01/12/2004', 'P');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
