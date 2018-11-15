/*
 Navicat Premium Data Transfer

 Source Server         : centos.shared
 Source Server Type    : MySQL
 Source Server Version : 50641
 Source Host           : centos.shared
 Source Database       : test

 Target Server Type    : MySQL
 Target Server Version : 50641
 File Encoding         : utf-8

 Date: 11/15/2018 15:58:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `tag`
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(3) unsigned DEFAULT NULL,
  `tag` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `tag`
-- ----------------------------
BEGIN;
INSERT INTO `tag` VALUES ('1', '1', '苹果'), ('2', '1', '橙子'), ('3', '1', '油桃'), ('4', '2', '兔子'), ('5', '2', '水牛'), ('6', '2', '老虎'), ('7', '2', '喜鹊'), ('8', '3', '汽车'), ('9', '3', '飞机'), ('10', '4', '青藏高原');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
