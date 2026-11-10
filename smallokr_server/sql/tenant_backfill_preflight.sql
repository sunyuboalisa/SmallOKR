-- Read-only. Run each section against the indicated business database before migration.
-- Compare owner IDs with the current SmallOKR tenant members from alisa-user.
-- Any NULL/empty owner or orphaned child must be resolved before cutover.

-- Target database.
SELECT user_id, COUNT(*) AS target_count
FROM tb_target
GROUP BY user_id;

SELECT COUNT(*) AS orphaned_results
FROM tb_result AS result
LEFT JOIN tb_target AS target ON target.target_id = result.target_id
WHERE target.target_id IS NULL;

-- Todo database.
SELECT user_id, COUNT(*) AS todo_count
FROM tb_todo
GROUP BY user_id;

SELECT COUNT(*) AS orphaned_repeat_rules
FROM tb_todo_repeat AS repeat_rule
LEFT JOIN tb_todo AS todo ON BINARY todo.todo_id = repeat_rule.todo_id
WHERE todo.todo_id IS NULL;
