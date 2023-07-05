/* MySql quiz database */

/* Cards table */
CREATE TABLE `cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `collectionId` int(11) NOT NULL,
  `frontContent` varchar(255) NOT NULL,
  `backContent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  SECONDARY KEY (`collectionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/* Collections table */
CREATE TABLE `collections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

