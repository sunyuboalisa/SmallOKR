-- Optional, manual migration. Check existing indexes before running once.
-- Uses the database names from this repository's schema files.
-- Each index matches a WHERE/JOIN/ORDER BY in the current MyBatis mappers.
-- Run on a staging copy and compare EXPLAIN before applying to a deployed database.

USE db_todo;
ALTER TABLE tb_todo
  ADD INDEX idx_todo_user_begin (user_id, todo_begin_date);
ALTER TABLE tb_todo_repeat
  ADD INDEX idx_todo_repeat_todo_repeat (todo_id, repeat_id);
ALTER TABLE tb_dic_entry
  ADD INDEX idx_dic_entry_dic (dic_id),
  ADD INDEX idx_dic_entry_value (dic_entry_value);

USE db_target;
ALTER TABLE tb_target
  ADD INDEX idx_target_user (user_id);
ALTER TABLE tb_result
  ADD INDEX idx_result_target_time (target_id, cre_time);

-- Rollback, if needed (execute separately):
-- ALTER TABLE db_todo.tb_todo DROP INDEX idx_todo_user_begin;
-- ALTER TABLE db_todo.tb_todo_repeat DROP INDEX idx_todo_repeat_todo_repeat;
-- ALTER TABLE db_todo.tb_dic_entry DROP INDEX idx_dic_entry_dic, DROP INDEX idx_dic_entry_value;
-- ALTER TABLE db_target.tb_target DROP INDEX idx_target_user;
-- ALTER TABLE db_target.tb_result DROP INDEX idx_result_target_time;
