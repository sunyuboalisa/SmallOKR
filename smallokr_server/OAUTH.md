# SmallOKR 第三方应用接入

多租户、管理员审批、后台应用和客户端空间选择见 [MULTITENANCY.md](../../alisa-cloud/MULTITENANCY.md)。启用前分别执行本项目 `sql/tenant_target.sql` 和 `sql/tenant_todo.sql`，并确认原有数据归属；本次未迁移线上数据。

完整启用和接入说明见 [alisa-cloud/OAUTH.md](../../alisa-cloud/OAUTH.md)，权限目录样例在 [oauth-smallokr.yml](../../alisa-cloud/examples/oauth-smallokr.yml)。

本次业务改动：

- 目标接口使用 `smallokr:target:read/create/update/delete`。
- 阶段成果接口使用 `smallokr:result:read/create/update/delete`。
- 待办接口使用 `smallokr:todo:read/create/update/delete`；重复规则修改使用 `todo:update`，字典读取使用 `todo:read`。
- Trace 当前转发目标列表，使用 `target:read`。
- 所有查询从已验证 Bearer token 获取用户身份，不再接受任意 userId；修改和删除验证对象归属，成果及重复规则不能通过修改父级 ID 转移归属。
- 原有第一方 JWT 保持登录协议，三个业务服务的 `JWT_SECRET` 必须与 alisa-user 一致。已对齐本机忽略跟踪的 `.env`，密钥没有写入源码。
- OAuth 验证凭据只放后端，客户端继续使用 Bearer token。未配置内省地址和凭据时拒绝第三方 token。

服务部署顺序：先发布本次业务服务，再发布网关配置。`gateway-routes.yml` 的 `delegated-ready: true` 仅能用于已部署本次 Bearer 校验的后端；旧服务不得打开该标记。OAuth 功能需在用户服务手动建表、配置并启用，本次未操作运行中 userservice 或线上数据库。

测试：在 alisa-cloud 执行 `mvn -pl alisa-user,alisa-gateway -am test`，在本目录执行 `mvn test`。
