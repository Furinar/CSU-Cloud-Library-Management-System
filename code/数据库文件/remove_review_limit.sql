-- 移除每本书每个用户只能评价一次的限制
-- 如果你的数据库中已经存在 review 表，请执行以下命令：

ALTER TABLE `review` DROP INDEX `uk_user_book`;
