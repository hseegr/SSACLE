DROP TABLE IF EXISTS `Team`;

CREATE TABLE `Team` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`sprint_id` BIGINT NOT NULL,
	`name` VARCHAR(50) NULL,
	`count` INT NULL,
	`is_full` BOOLEAN NULL
);

DROP TABLE IF EXISTS `Lunch`;

CREATE TABLE `Lunch` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`day` DATETIME NULL,
	`menu_name` VARCHAR(255) NULL,
	`votes` INT NULL,
	`image_url` VARCHAR(1024) NULL
);

DROP TABLE IF EXISTS `TODO`;

CREATE TABLE `TODO` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`team_id` BIGINT NOT NULL,
	`content` VARCHAR(1024) NULL,
	`date` DATE NULL,
	`is_done` BOOLEAN NULL
);

DROP TABLE IF EXISTS `Sprint`;

CREATE TABLE `Sprint` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`category_id` BIGINT NOT NULL,
	`ssaldcup_id` BIGINT NULL,
	`name` VARCHAR(50) NULL,
	`description` VARCHAR(50) NULL,
	`started_at` DATETIME NULL,
	`end_at` DATETIME NULL,
	`prsentation` DATETIME NULL,
	`recruit` INT NULL,
	`participation` INT NULL,
	`detail_topic` VARCHAR(1024) NULL,
	`created_at` DATETIME NULL,
	`sequence` INT NULL,
	`tag` VARCHAR(512) NULL
);

DROP TABLE IF EXISTS `SSALDCUP`;

CREATE TABLE `SSALDCUP` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`category_id` BIGINT NOT NULL,
	`name` VARCHAR(50) NULL,
	`description` VARCHAR(50) NULL,
	`team_count` INT NULL,
	`recruit_count` INT NULL,
	`is_process` BOOLEAN NULL,
	`started_at` DATETIME NULL,
	`end_at` DATETIME NULL,
	`created_at` DATETIME NULL
);

DROP TABLE IF EXISTS `Board`;

CREATE TABLE `Board` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`user_id` BIGINT NOT NULL,
	`title` VARCHAR(100) NULL,
	`content` VARCHAR(512) NULL,
	`tag` VARCHAR(1024) NULL,
	`image_url` VARCHAR(1024) NULL,
	`type` ENUM('STUDY', 'FREE') NULL,
	`created_at` DATETIME NULL,
	`updated_at` DATETIME NULL
);

DROP TABLE IF EXISTS `Vote`;

CREATE TABLE `Vote` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`user_id` BIGINT NOT NULL,
	`lunch_id` BIGINT NOT NULL,
	`vote_day` DATETIME NULL
);

DROP TABLE IF EXISTS `Judgment`;

CREATE TABLE `Judgment` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`user_id` BIGINT NOT NULL,
	`sprint_id` BIGINT NOT NULL,
	`recruit` INT NULL,
	`count` INT NULL,
	`created_at` DATETIME NULL
);

DROP TABLE IF EXISTS `Comment`;

CREATE TABLE `Comment` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`parent_id` BIGINT NULL,
	`board_id` BIGINT NOT NULL,
	`content` VARCHAR(255) NULL,
	`created_at` DATETIME NULL,
	`updated_at` DATETIME NULL,
	`disclosure` BOOLEAN NULL
);

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`email` VARCHAR(255) NULL,
	`password` VARCHAR(255) NULL,
	`name` VARCHAR(10) NULL,
	`student_number` VARCHAR(7) NULL,
	`nickname` VARCHAR(20) NULL,
	`level` INT NOT NULL DEFAULT 1,
	`experience` INT NULL,
	`pickles` INT NULL,
	`role` ENUM('STUDENT', 'ALUMNI', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
	`is_graduate` BOOLEAN NULL,
	`created_at` DATETIME NULL,
	`deleted_at` DATETIME NULL,
	`is_delete` BOOLEAN NULL
);

DROP TABLE IF EXISTS `Note`;

CREATE TABLE `Note` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`team_id` BIGINT NOT NULL,
	`name` VARCHAR(50) NULL,
	`url` VARCHAR(1024) NULL,
	`created_at` DATETIME NULL
);

DROP TABLE IF EXISTS `Category`;

CREATE TABLE `Category` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`parent_id` BIGINT NULL,
	`category_name` VARCHAR(255) NULL,
	`is_leaf` BOOLEAN NULL,
	`image` VARCHAR(1024) NULL
);

DROP TABLE IF EXISTS `User_Team`;

CREATE TABLE `User_Team` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`user_id` BIGINT NOT NULL,
	`team_id` BIGINT NOT NULL
);

DROP TABLE IF EXISTS `QuestionCard`;

CREATE TABLE `QuestionCard` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY,
	`sprint_id` BIGINT NOT NULL,
	`title` VARCHAR(50) NULL,
	`description` VARCHAR(512) NULL,
	`is_opened` BOOLEAN NULL,
	`created_at` DATETIME NULL
);

ALTER TABLE `Team` ADD CONSTRAINT `FK_Sprint_TO_Team_1` FOREIGN KEY (`sprint_id`) REFERENCES `Sprint` (`id`);
ALTER TABLE `TODO` ADD CONSTRAINT `FK_Team_TO_TODO_1` FOREIGN KEY (`team_id`) REFERENCES `Team` (`id`);
ALTER TABLE `Sprint` ADD CONSTRAINT `FK_Category_TO_Sprint_1` FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`);
ALTER TABLE `Sprint` ADD CONSTRAINT `FK_SSALDCUP_TO_Sprint_1` FOREIGN KEY (`ssaldcup_id`) REFERENCES `SSALDCUP` (`id`);
ALTER TABLE `Board` ADD CONSTRAINT `FK_User_TO_Board_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
ALTER TABLE `Vote` ADD CONSTRAINT `FK_User_TO_Vote_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
ALTER TABLE `Vote` ADD CONSTRAINT `FK_Lunch_TO_Vote_1` FOREIGN KEY (`lunch_id`) REFERENCES `Lunch` (`id`);
ALTER TABLE `Comment` ADD CONSTRAINT `FK_Board_TO_Comment_1` FOREIGN KEY (`board_id`) REFERENCES `Board` (`id`);
ALTER TABLE `Note` ADD CONSTRAINT `FK_Team_TO_Note_1` FOREIGN KEY (`team_id`) REFERENCES `Team` (`id`);
ALTER TABLE `User_Team` ADD CONSTRAINT `FK_User_TO_User_Team_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
ALTER TABLE `User_Team` ADD CONSTRAINT `FK_Team_TO_User_Team_1` FOREIGN KEY (`team_id`) REFERENCES `Team` (`id`);
