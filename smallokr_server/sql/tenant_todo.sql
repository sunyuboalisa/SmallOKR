-- Execute only against the todo-service database, before enabling tenant mode.
ALTER TABLE tb_todo ADD tenant_id varchar(64) NOT NULL DEFAULT '';
CREATE INDEX idx_todo_tenant_user ON tb_todo(tenant_id,user_id);
-- Repeat rules inherit tenant ownership through their todo_id. Dictionaries stay shared metadata.
