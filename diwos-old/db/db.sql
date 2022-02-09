CREATE TABLE `diwos`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_login` VARCHAR(255) NULL,
  `user_password` VARCHAR(255) NULL,
  `user_token` VARCHAR(255) NULL,
  `user_vk` VARCHAR(255) NULL,
  `user_nickname` VARCHAR(255) NULL,
  `user_email` VARCHAR(255) NULL,
  `user_obj` INT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `diwos`.`images` (
  `id` INT NOT NULL,
  `desc` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `diwos`.`objects` (
  `obj_id` INT NOT NULL AUTO_INCREMENT,
  `obj_x` VARCHAR(45) NULL,
  `obj_y` VARCHAR(45) NULL,
  `obj_prop` VARCHAR(45) NULL,
  `obj_pic` VARCHAR(45) NULL,
  `obj_name` VARCHAR(45) NULL,
  `obj_desc` VARCHAR(45) NULL,
  `obj_size` VARCHAR(45) NULL,
  PRIMARY KEY (`obj_id`));