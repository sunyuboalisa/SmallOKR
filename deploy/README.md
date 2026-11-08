# SmallOKR server deployment

Argo CD application: `smallokr`; namespace: `alisa-infra`.

The build hook fetches fixed SmallOKR and alisa-cloud commits, runs Maven tests,
and publishes a versioned runtime image to the existing private registry.
The three Deployments register their Pod IP with the existing Nacos instance.
The public endpoint remains `https://alisa.vip.cpolar.cn/alisa-gateway`.
The account service remains the existing externally hosted alisa-user.

Existing dependencies: ConfigMap `alisa-nacos`, Secrets `alisa-jwt` and
`alisa-registry`. Each `smallokr-*-env` Secret must contain `MYSQL_URL`,
`MYSQL_USERNAME`, and `MYSQL_PASSWORD` for that service's existing database.
Do not commit credentials. The Application ignores Secret data drift and uses
RespectIgnoreDifferences; Secret resources are protected from pruning/deletion.
Initialize those Secret values before full synchronization.

Apply/create `deploy/argocd/application.yaml`, synchronize only the three Secret
placeholders, populate them using an authenticated administration interface,
then perform a full sync. No schema migration or account-service restart is
part of this deployment. Check deployment health, Nacos registration, and an
authenticated public read of target/todo/trace after synchronization.
