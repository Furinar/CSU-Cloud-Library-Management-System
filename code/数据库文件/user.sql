-- 插入用户表测试数据
INSERT INTO `user` (
    `id`,
    `username`,
    `password`,
    `email`,
    `role`,
    `is_deleted`,
    `gmt_create`,
    `gmt_modified`
) VALUES
-- 管理员账号
(0, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '123456@qq.com', 'ADMIN', 0, '2025-12-11 22:41:48', '2025-12-12 11:35:55'),
-- 普通用户1
(1, 'user', 'e10adc3949ba59abbe56e057f20f883e', 'test1@library.com', 'user', 0, '2025-12-11 22:40:00', '2025-12-11 22:44:02'),
-- 普通用户2
(2, 'test_user2', 'e10adc3949ba59abbe56e057f20f883e', 'test2@library.com', 'user', 0, '2025-12-11 22:40:00', '2025-12-11 22:43:46'),
-- 普通用户3
(3, 'test_user3', 'e10adc3949ba59abbe56e057f20f883e', 'test3@library.com', 'user', 0, '2025-12-11 22:40:00', '2025-12-11 22:43:46'),
-- 普通用户4
(4, 'test_user4', 'e10adc3949ba59abbe56e057f20f883e', 'test4@library.com', 'user', 0, '2025-12-11 22:40:00', '2025-12-11 22:43:46'),
-- 普通用户5
(5, 'test_user5', 'e10adc3949ba59abbe56e057f20f883e', 'test5@library.com', 'user', 0, '2025-12-11 22:40:00', '2025-12-11 22:43:46'),
-- 普通用户6
(6, 'test_user6', 'e10adc3949ba59abbe56e057f20f883e', 'test6@library.com', 'user', 0, '2025-12-11 22:40:00', '2025-12-11 22:43:46');
