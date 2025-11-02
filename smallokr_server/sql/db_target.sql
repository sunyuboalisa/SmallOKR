/*
 Navicat Premium Dump SQL

 Source Server         : aliyun
 Source Server Type    : MySQL
 Source Server Version : 80043 (8.0.43-0ubuntu0.22.04.1)
 Source Host           : 47.94.97.3:3306
 Source Schema         : db_target

 Target Server Type    : MySQL
 Target Server Version : 80043 (8.0.43-0ubuntu0.22.04.1)
 File Encoding         : 65001

 Date: 15/10/2025 21:37:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS db_target
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
-- ----------------------------
-- Table structure for tb_dic
-- ----------------------------
DROP TABLE IF EXISTS `tb_dic`;
CREATE TABLE `tb_dic` (
  `dic_id` varchar(255) NOT NULL,
  `dic_name` varchar(255) NOT NULL,
  PRIMARY KEY (`dic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of tb_dic
-- ----------------------------
BEGIN;
INSERT INTO `tb_dic` (`dic_id`, `dic_name`) VALUES ('6d8ef67cfdeb4b98b9020baacaed1b11', 'status_dic');
COMMIT;

-- ----------------------------
-- Table structure for tb_dic_entry
-- ----------------------------
DROP TABLE IF EXISTS `tb_dic_entry`;
CREATE TABLE `tb_dic_entry` (
  `dic_entry_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dic_entry_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dic_entry_value` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dic_id` varchar(32) NOT NULL,
  PRIMARY KEY (`dic_entry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of tb_dic_entry
-- ----------------------------
BEGIN;
INSERT INTO `tb_dic_entry` (`dic_entry_id`, `dic_entry_name`, `dic_entry_value`, `dic_id`) VALUES ('0257659eab8e4f48a7c09c5716017efe', 'status_finished', 'finished', '6d8ef67cfdeb4b98b9020baacaed1b11');
INSERT INTO `tb_dic_entry` (`dic_entry_id`, `dic_entry_name`, `dic_entry_value`, `dic_id`) VALUES ('483957423c634e22877ac301ce4e32f1', 'status_created', 'created', '6d8ef67cfdeb4b98b9020baacaed1b11');
INSERT INTO `tb_dic_entry` (`dic_entry_id`, `dic_entry_name`, `dic_entry_value`, `dic_id`) VALUES ('92e68f9ed41546f4a9606693c3caa40b', 'status_started', 'started', '6d8ef67cfdeb4b98b9020baacaed1b11');
COMMIT;

-- ----------------------------
-- Table structure for tb_result
-- ----------------------------
DROP TABLE IF EXISTS `tb_result`;
CREATE TABLE `tb_result` (
  `result_id` char(32) NOT NULL,
  `result_name` varchar(45) NOT NULL,
  `result_value` varchar(45) NOT NULL,
  `target_id` char(32) NOT NULL,
  `cre_time` datetime DEFAULT NULL,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of tb_result
-- ----------------------------
BEGIN;
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('0c2f7769ddaf4222a2d7b792a3f717d8', '模电', '实践', '', '2024-11-19 04:47:46');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('27e5c595e64b44ea9d4e459c5da7825e', '模电', '实践', '', '2024-11-19 04:47:46');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('34c898ac5f2c4fc29f4de0006f9e050d', '优化UI', '简洁好用', 'a9038ede035c4d1c88743f9160fc0b78', '2024-11-19 01:17:51');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('589a7775c5c94065beed10c9bf0b64e3', '数电1', '实践', '611168159ff94b0a89873eaf6faf38e1', '2024-11-19 04:48:44');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('6695aa968fbd4632aad92d6e8ffbee8c', '优化UI', '简洁好用', 'a9038ede035c4d1c88743f9160fc0b78', '2024-11-19 01:17:51');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('6b290e54ee854fc696800f945325cbaf', 'UI12112', '简洁 好用1', '3074537647984359a38bd210985ed47e', '2024-11-18 21:56:33');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('755a3a7b35c04f7f90b2aa361e1a531e', '上线11', '发布到商店2', '3074537647984359a38bd210985ed47e', '2024-11-18 21:56:33');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('7d218de866b84e6b9adeb71cd1550418', '模电', '实践', '', '2024-11-19 04:47:46');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('8d86b8799f784995aa22052ba0094d4f', '模电1', '实践', '611168159ff94b0a89873eaf6faf38e1', '2024-11-19 04:48:44');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('b2288f4ad03047d7bccc6fd099080018', 'test', 'test', '3074537647984359a38bd210985ed47e', '2025-02-19 16:04:02');
INSERT INTO `tb_result` (`result_id`, `result_name`, `result_value`, `target_id`, `cre_time`) VALUES ('bf91658913404a0ba141ace61b819bbb', '机器人', '实践', '611168159ff94b0a89873eaf6faf38e1', '2024-11-19 04:48:44');
COMMIT;

-- ----------------------------
-- Table structure for tb_target
-- ----------------------------
DROP TABLE IF EXISTS `tb_target`;
CREATE TABLE `tb_target` (
  `target_id` char(32) NOT NULL,
  `target_name` varchar(45) NOT NULL,
  `target_description` varchar(200) DEFAULT NULL,
  `user_id` char(32) DEFAULT NULL,
  `cre_time` varchar(45) DEFAULT NULL,
  `target_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of tb_target
-- ----------------------------
BEGIN;
INSERT INTO `tb_target` (`target_id`, `target_name`, `target_description`, `user_id`, `cre_time`, `target_status`) VALUES ('3074537647984359a38bd210985ed47e', 'smallokr上线1', '完善体验', '73AE89EE58F44DA4A59BCB047E8184E2', '2024-07-25 08:57:55.696941', '0');
INSERT INTO `tb_target` (`target_id`, `target_name`, `target_description`, `user_id`, `cre_time`, `target_status`) VALUES ('611168159ff94b0a89873eaf6faf38e1', 'alisa内核', '微内核架构\nlinux 内核\n自己实现内核', '73AE89EE58F44DA4A59BCB047E8184E2', '2024-11-19 04:48:28.842893', '0');
INSERT INTO `tb_target` (`target_id`, `target_name`, `target_description`, `user_id`, `cre_time`, `target_status`) VALUES ('a9038ede035c4d1c88743f9160fc0b78', '科学社区上线', '完善', '73AE89EE58F44DA4A59BCB047E8184E2', '2024-10-14 13:33:58.004854', '0');
COMMIT;

-- ----------------------------
-- Table structure for undo_log
-- ----------------------------
DROP TABLE IF EXISTS `undo_log`;
CREATE TABLE `undo_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `branch_id` bigint NOT NULL,
  `xid` varchar(100) NOT NULL,
  `context` varchar(128) NOT NULL,
  `rollback_info` longblob NOT NULL,
  `log_status` int NOT NULL,
  `log_created` datetime NOT NULL,
  `log_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_undo_log` (`xid`,`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of undo_log
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
