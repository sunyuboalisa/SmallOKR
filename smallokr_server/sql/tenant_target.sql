-- Execute only against the target-service database, before enabling tenant mode.
ALTER TABLE tb_target ADD tenant_id varchar(64) NOT NULL DEFAULT '';
CREATE INDEX idx_target_tenant_user ON tb_target(tenant_id,user_id);
-- Results inherit tenant ownership through their target_id. Existing rows remain legacy until explicitly migrated.
