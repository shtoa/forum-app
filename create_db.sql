# Create database script for My4uM

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema forum_app
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema forum_app
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `forum_app`;
USE `forum_app` ;

-- -----------------------------------------------------
-- Table `forum_app`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`users` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Email` VARCHAR(100) NOT NULL,
  `FirstName` VARCHAR(45) NOT NULL,
  `LastName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX `Username` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `Email` (`Email` ASC) VISIBLE,
  UNIQUE INDEX `UserID_UNIQUE` (`UserID` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `forum_app`.`topics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`topics` (
  `TopicID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(255) NOT NULL,
  `UserID` INT NOT NULL,
  `CreatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`TopicID`),
  UNIQUE INDEX `Title_UNIQUE` (`Title` ASC) VISIBLE,
  UNIQUE INDEX `TopicID_UNIQUE` (`TopicID` ASC) VISIBLE,
  INDEX `UserId_topics` (`UserID` ASC) VISIBLE,
  CONSTRAINT `UserId_topics`
    FOREIGN KEY (`UserID`)
    REFERENCES `forum_app`.`users` (`UserID`))
ENGINE = InnoDB
AUTO_INCREMENT = 66
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `forum_app`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`posts` (
  `PostID` INT NOT NULL AUTO_INCREMENT,
  `TopicID` INT NOT NULL,
  `UserID` INT NOT NULL,
  `Title` VARCHAR(45) NULL DEFAULT NULL,
  `Content` TEXT NOT NULL,
  `CreatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PostID`),
  UNIQUE INDEX `PostID_UNIQUE` (`PostID` ASC) VISIBLE,
  INDEX `TopicId_idx` (`TopicID` ASC) VISIBLE,
  INDEX `UserId_idx` (`UserID` ASC) VISIBLE,
  CONSTRAINT `TopicId_posts`
    FOREIGN KEY (`TopicID`)
    REFERENCES `forum_app`.`topics` (`TopicID`),
  CONSTRAINT `UserId_posts`
    FOREIGN KEY (`UserID`)
    REFERENCES `forum_app`.`users` (`UserID`))
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `forum_app`.`replies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`replies` (
  `ReplyID` INT NOT NULL AUTO_INCREMENT,
  `PostID` INT NOT NULL,
  `ParentID` INT NULL DEFAULT NULL,
  `UserID` INT NOT NULL,
  `Content` TEXT NOT NULL,
  `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ReplyID`),
  UNIQUE INDEX `replyId_UNIQUE` (`ReplyID` ASC) VISIBLE,
  INDEX `UserId_replies_idx` (`UserID` ASC) VISIBLE,
  INDEX `PostId_replies_idx` (`PostID` ASC) VISIBLE,
  INDEX `ParentId_replies_idx` (`ParentID` ASC) VISIBLE,
  CONSTRAINT `ParentId_replies`
    FOREIGN KEY (`ParentID`)
    REFERENCES `forum_app`.`replies` (`ReplyID`),
  CONSTRAINT `PostId_replies`
    FOREIGN KEY (`PostID`)
    REFERENCES `forum_app`.`posts` (`PostID`),
  CONSTRAINT `UserId_replies`
    FOREIGN KEY (`UserID`)
    REFERENCES `forum_app`.`users` (`UserID`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `forum_app`.`dislikes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`dislikes` (
  `DislikeID` INT NOT NULL AUTO_INCREMENT,
  `PostID` INT NOT NULL,
  `ReplyID` INT NULL DEFAULT NULL,
  `UserID` INT NOT NULL,
  `CreatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`DislikeID`),
  UNIQUE INDEX `DislikeID_UNIQUE` (`DislikeID` ASC) VISIBLE,
  INDEX `UserID_dislikes_idx` (`UserID` ASC) VISIBLE,
  INDEX `ReplyID_dislikes_idx` (`ReplyID` ASC) VISIBLE,
  INDEX `PostID_dislikes_idx` (`PostID` ASC) VISIBLE,
  CONSTRAINT `PostID_dislikes`
    FOREIGN KEY (`PostID`)
    REFERENCES `forum_app`.`posts` (`PostID`),
  CONSTRAINT `ReplyID_dislikes`
    FOREIGN KEY (`ReplyID`)
    REFERENCES `forum_app`.`replies` (`ReplyID`),
  CONSTRAINT `UserID_dislikes`
    FOREIGN KEY (`UserID`)
    REFERENCES `forum_app`.`users` (`UserID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `forum_app`.`likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`likes` (
  `LikeID` INT NOT NULL AUTO_INCREMENT,
  `PostID` INT NOT NULL,
  `UserID` INT NOT NULL,
  `ReplyID` INT NULL DEFAULT NULL,
  `CreatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LikeID`),
  UNIQUE INDEX `LikeID_UNIQUE` (`LikeID` ASC) VISIBLE,
  INDEX `PostId_likes_idx` (`PostID` ASC) VISIBLE,
  INDEX `UserId_likes_idx` (`UserID` ASC) VISIBLE,
  INDEX `ReplyId_likes_idx` (`ReplyID` ASC) VISIBLE,
  CONSTRAINT `PostId_likes`
    FOREIGN KEY (`PostID`)
    REFERENCES `forum_app`.`posts` (`PostID`),
  CONSTRAINT `ReplyId_likes`
    FOREIGN KEY (`ReplyID`)
    REFERENCES `forum_app`.`replies` (`ReplyID`),
  CONSTRAINT `UserId_likes`
    FOREIGN KEY (`UserID`)
    REFERENCES `forum_app`.`users` (`UserID`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `forum_app`.`members`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`members` (
  `MemberID` INT NOT NULL AUTO_INCREMENT,
  `TopicID` INT NOT NULL,
  `UserID` INT NOT NULL,
  PRIMARY KEY (`MemberID`),
  UNIQUE INDEX `MemberID_UNIQUE` (`MemberID` ASC) VISIBLE,
  UNIQUE INDEX `Unique_Combo` (`TopicID` ASC, `UserID` ASC) VISIBLE,
  INDEX `UserID_idx` (`UserID` ASC) VISIBLE,
  INDEX `TopicID_idx` (`TopicID` ASC) VISIBLE,
  CONSTRAINT `TopicID`
    FOREIGN KEY (`TopicID`)
    REFERENCES `forum_app`.`topics` (`TopicID`),
  CONSTRAINT `UserID`
    FOREIGN KEY (`UserID`)
    REFERENCES `forum_app`.`users` (`UserID`))
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `forum_app` ;

-- -----------------------------------------------------
-- Placeholder table for view `forum_app`.`postsauthors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`postsauthors` (`postID` INT, `postTitle` INT, `postContent` INT, `postCreatedAt` INT, `topicTitle` INT, `topicCreatedAt` INT, `UserID` INT);

-- -----------------------------------------------------
-- Placeholder table for view `forum_app`.`postsusername`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`postsusername` (`postID` INT, `postTitle` INT, `postContent` INT, `postCreatedAt` INT, `topicTitle` INT, `topicCreatedAt` INT, `UserID` INT, `Username` INT);

-- -----------------------------------------------------
-- Placeholder table for view `forum_app`.`topicsauthors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `forum_app`.`topicsauthors` (`topicTitle` INT, `topicCreatedAt` INT, `UserID` INT);

-- -----------------------------------------------------
-- procedure account_info
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `account_info`(IN targetUserID INT)
BEGIN
	
    DECLARE userTopicsCount INT;
    DECLARE userPostsCount INT;
    
    SELECT COUNT(*)
    FROM topics
    WHERE topics.UserID = targetUserID
    INTO userTopicsCount;
    
    SELECT COUNT(*)
    FROM posts
    WHERE posts.UserID = targetUserID
    INTO userPostsCount;
    
    IF ISNULL(userTopicsCount) && ISNULL(userPostsCount) THEN 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User Has No Created Topics and Posts';
    ELSEIF ISNULL(userTopicsCount) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User Has No Created Topics';
    ELSEIF ISNULL(userPostsCount) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User Has No Created Posts';
    ELSE
		SELECT *  FROM (SELECT posts.PostID as postID, posts.Title as postTitle, posts.Content as postContent, 
        posts.CreatedAt as postCreatedAt, topics.Title as topicTitle, 
        topics.CreatedAt as topicCreatedAt, posts.UserID
         from posts INNER JOIN topics ON posts.TopicID = topics.TopicID 
		 where topics.UserID = targetUserID && posts.UserID = targetUserID) as userMade 
         JOIN users ON users.UserID = userMade.UserID;
    END IF;
  

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure checkUsersPosts
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `checkUsersPosts`(IN targetUserID INT)
BEGIN
	
	DECLARE userPostsCount INT;
    
    SELECT COUNT(*)
    FROM posts
    WHERE posts.UserID = targetUserID
    INTO userPostsCount;
    
	IF ISNULL(userPostsCount) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User Has No Created Posts';
    ELSE
		SELECT * FROM postsauthors
		JOIN users ON users.UserID = postsauthors.UserID WHERE postsauthors.UserID = targetUserID;
    END IF;
    
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure checkUsersTopics
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `checkUsersTopics`(IN targetUserID INT)
BEGIN
	DECLARE userTopicsCount INT;
    
    SELECT COUNT(*)
    FROM topics
    WHERE topics.UserID = targetUserID
    INTO userTopicsCount;
    
	IF ISNULL(userTopicsCount) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User Has No Created Topics';
    ELSE
		SELECT * FROM topicsauthors
		JOIN users ON users.UserID = topicsauthors.UserID WHERE topicsauthors.UserID = targetUserID;
    END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getAccountInfo
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAccountInfo`(IN targetUserID INT)
BEGIN
		SELECT *  FROM users WHERE users.userID = targetUserID;
        
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getAvailableTopics
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAvailableTopics`()
BEGIN

SELECT DISTINCT(Title)
FROM topics;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getMemberships
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getMemberships`(IN UserID INT)
BEGIN

	SELECT topics.Title FROM members join topics on members.TopicID = topics.TopicID where members.UserID = UserID;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getPostInfo
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPostInfo`(IN PostID INT)
BEGIN

	SELECT * FROM postsauthors WHERE postsauthors.PostID = PostID;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getRecentPosts
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getRecentPosts`()
BEGIN

SELECT * 
FROM postsauthors JOIN users ON postsauthors.UserID = users.UserID
ORDER BY postCreatedAt DESC;




END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure joinTopic
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `joinTopic`(IN InUserID INT, IN TopicName VARCHAR(45))
BEGIN
	
    
  
    SET @TopicID := (SELECT TopicID FROM topics WHERE Title = TopicName);
    
    
    
    INSERT INTO members (TopicID, UserID) VALUES (@TopicID, InUserID);
    
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchPostContent
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchPostContent`(IN keyword VARCHAR(45))
BEGIN
	SELECT * from postsusername where (postContent like Concat('%', keyword, '%'));
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchPostTitle
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchPostTitle`(IN keyword VARCHAR(45))
BEGIN
	SELECT * from postsusername where (postTitle like Concat('%', keyword, '%')  );
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchTopics
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchTopics`(IN keyword VARCHAR(45))
BEGIN
	SELECT topicTitle from topicsauthors where (topicTitle like Concat('%', keyword, '%')  );
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchUsers
-- -----------------------------------------------------

DELIMITER $$
USE `forum_app`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchUsers`(IN keyword VARCHAR(45))
BEGIN
	SELECT Username from users where (Username like Concat('%', keyword, '%')  );
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `forum_app`.`postsauthors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forum_app`.`postsauthors`;
USE `forum_app`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `forum_app`.`postsauthors` AS select `forum_app`.`posts`.`PostID` AS `postID`,`forum_app`.`posts`.`Title` AS `postTitle`,`forum_app`.`posts`.`Content` AS `postContent`,`forum_app`.`posts`.`CreatedAt` AS `postCreatedAt`,`forum_app`.`topics`.`Title` AS `topicTitle`,`forum_app`.`topics`.`CreatedAt` AS `topicCreatedAt`,`forum_app`.`posts`.`UserID` AS `UserID` from (`forum_app`.`posts` join `forum_app`.`topics` on((`forum_app`.`posts`.`TopicID` = `forum_app`.`topics`.`TopicID`)));

-- -----------------------------------------------------
-- View `forum_app`.`postsusername`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forum_app`.`postsusername`;
USE `forum_app`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `forum_app`.`postsusername` AS select `forum_app`.`postsauthors`.`postID` AS `postID`,`forum_app`.`postsauthors`.`postTitle` AS `postTitle`,`forum_app`.`postsauthors`.`postContent` AS `postContent`,`forum_app`.`postsauthors`.`postCreatedAt` AS `postCreatedAt`,`forum_app`.`postsauthors`.`topicTitle` AS `topicTitle`,`forum_app`.`postsauthors`.`topicCreatedAt` AS `topicCreatedAt`,`forum_app`.`postsauthors`.`UserID` AS `UserID`,`forum_app`.`users`.`Username` AS `Username` from (`forum_app`.`postsauthors` join `forum_app`.`users` on((`forum_app`.`postsauthors`.`UserID` = `forum_app`.`users`.`UserID`)));

-- -----------------------------------------------------
-- View `forum_app`.`topicsauthors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forum_app`.`topicsauthors`;
USE `forum_app`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `forum_app`.`topicsauthors` AS select `forum_app`.`topics`.`Title` AS `topicTitle`,`forum_app`.`topics`.`CreatedAt` AS `topicCreatedAt`,`forum_app`.`topics`.`UserID` AS `UserID` from `forum_app`.`topics`;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

# Create the app user and give it access to the database
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON forum_app.* TO 'appuser'@'localhost';