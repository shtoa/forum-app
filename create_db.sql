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
CREATE DATABASE IF NOT EXISTS `forum_app`;
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
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT = 7;


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
AUTO_INCREMENT = 63
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


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
AUTO_INCREMENT = 35
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


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
AUTO_INCREMENT = 6
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;i;


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
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


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
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT = 2;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


# Create the app user and give it access to the database
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON forum_app.* TO 'appuser'@'localhost';
