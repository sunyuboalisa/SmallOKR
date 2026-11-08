# SmallOKR releases from main

Business code and Kubernetes manifests live on `main`. Argo CD application
`smallokr` watches `deploy/kubernetes` and synchronizes manifest changes.

1. A server change, common-dependency change, or manual workflow dispatch runs
   `SmallOKR Server Release`. CI tests and packages the pinned common dependency
   and the server with Java 17.
2. After successful CI, the workflow records the tested source commit in the
   build Job and uses the same SHA in all three runtime image references. The
   release commit skips CI and the workflow ignores generated manifest paths,
   preventing build loops. A concurrent newer server change supersedes an old
   release. The common source revision is maintained in `deploy/build-inputs.json`.
3. Argo CD builds the image in its existing cluster hook and rolls out the three
   services. The self-hosted Windows runner was offline during this migration,
   so image building stays on the cluster, where the Registry is reachable.

Registry traffic uses `registry.kind.internal:5000` and the node's existing
mkcert CA. The build uses host networking to reach the Registry IPv6 endpoint.
The Maven cache persists between builds. The public client endpoint is
`https://alisa.vip.cpolar.cn/alisa-gateway`; account APIs use existing alisa-user.

Existing cluster dependencies are ConfigMap `alisa-nacos`, Secrets `alisa-jwt`
and `alisa-registry`, and the three `smallokr-*-env` database Secrets.
Credentials are populated out of Git. Secret data differences are ignored and
pruning/deletion is disabled for those Secrets. This release does not migrate
schemas.

For a new installation, create `deploy/argocd/application.yaml`, synchronize only
the three Secret placeholders, populate their MYSQL_URL, MYSQL_USERNAME, and
MYSQL_PASSWORD, then perform a full sync. Existing installations retain their
Secret values when switching this Application to main.

To roll back a release, revert the release manifest commit on main, restoring
both SOURCE_REVISION and the three corresponding image references together.
Argo CD will synchronize that exact release. Check Argo CD health, Nacos
registration, and authenticated reads after each rollout.
