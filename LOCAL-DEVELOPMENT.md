# Windows 本机开发环境

## 当前启动配置（2026-11-03）

用户服务源码现已迁往同级 `alisa-cloud/alisa-user`，由 alisa-cloud 构建和部署；SmallOKR 只构建目标、待办、跟踪三个服务。现有运行的 userservice 未切换或重启。未来公共网关接入本项目时加载 `smallokr_server/gateway-routes.yml`，配置方法见 `alisa-cloud/docs/user-service-migration.md`。

旧 `smallokr_server/userservice` 目录及历史运行包已清理。源码迁移备份保留在忽略跟踪的 `smallokr_server/target/userservice-before-migration`，删除目录前的本地配置和迁移说明保存在 `smallokr_server/target/userservice-removal-backup`；账号服务统一在 `alisa-cloud/alisa-user` 维护。

- 使用已有的 `Pixel` 模拟器，Android API 35；下方 API 36 的配置记录属于早期排查历史。
- 在 `smallokr_server` 目录启动 `target/package` 下的目标、待办和跟踪服务，端口分别为 9081、9082、8083。userservice 沿用外部实例。
- traceservice 的 `.env` 导入路径统一为 `./traceservice/.env`，开发配置从中读取 Nacos 用户名、密码。
- 客户端在 `SmallOKR_App` 设置 `$env:APP_ENV='local'`，使用 `node node_modules/react-native/cli.js start --port 8087` 启动 Metro。
- 执行 `adb reverse tcp:8081 tcp:8087` 后打开 `com.smallokr/.MainActivity`。不更改 AVD 配置。

Android Studio 打开 `SmallOKR_App/android`。

- Java / Gradle JDK：`D:\DevEnvironment\Java\jdk-17.0.14`
- Node.js：22.15.0
- Android SDK：`C:\Users\lenovo\AppData\Local\Android\Sdk`
- SDK Platform：Android 36
- Build Tools：36.0.0
- NDK：27.1.12297006
- CMake：3.22.1
- Gradle：使用项目自带 `gradlew.bat`（9.0.0）
- 模拟器：`SmallOKR_API_36`，Pixel 7，Android 36 / x86_64
- Maven：`D:\DevEnvironment\apache-maven-3.9.11`

重启 Android Studio 和终端，使新增用户环境变量生效。在 Android Studio 的 Settings > Build, Execution, Deployment > Build Tools > Gradle 中，将 Gradle JDK 选择为上述 Java 17。SDK 路径已写入本机 `android/local.properties`，该文件不提交 Git。

## 启动客户端

在 Android Studio 的 Device Manager 启动 `SmallOKR_API_36`，或连接已开启 USB 调试的安卓手机。

在 PowerShell 中：

```powershell
cd D:\WorkSpace\Java\SmallOKR\SmallOKR_App
npm.cmd start
```

另开终端：

```powershell
cd D:\WorkSpace\Java\SmallOKR\SmallOKR_App
npm.cmd run android
```

仅构建模拟器调试 APK：

```powershell
cd D:\WorkSpace\Java\SmallOKR\SmallOKR_App\android
.\gradlew.bat assembleDebug -PreactNativeArchitectures=x86_64
```

项目原有 `npm run dev` / `npm run local` 使用 Unix 环境变量语法，PowerShell 可改为：

```powershell
$env:APP_ENV='local'
npm.cmd start -- --reset-cache
```

## 后端

Java 17 和 Maven 已具备；在 `smallokr_server` 运行 `mvn.cmd validate` 可校验模块配置。完整运行仍需按根目录 README 配置 MySQL、Redis、Nacos 和各服务环境变量。

## 网络

Gradle 的用户配置 `C:\Users\lenovo\.gradle\gradle.properties` 已配置本机现有代理，用于下载 Google/Maven 依赖。代理服务需保持开启；若代理端口改变，需要同步更新其中的 http/https proxyHost 和 proxyPort。

## 本次验证

- 后端 Maven 离线 validate：通过（仅校验模块配置）。
- 模拟器：ADB 连接正常，API 36，sys.boot_completed=1；已关闭后台验证实例。

- 客户端 assembleDebug（x86_64）：BUILD SUCCESSFUL；APK 位于 SmallOKR_App/android/app/build/outputs/apk/debug/app-debug.apk。

## 当前运行实例

- todoservice：9082，日志 `smallokr_server/target/run/todoservice.log`
- targetservice：9081，context path `/target-service`，日志 `smallokr_server/target/run/targetservice.log`
- traceservice：8083，日志 `smallokr_server/target/run/traceservice.log`
- userservice：沿用已运行的 `https://alisa.docker.local`，未启动或重启该服务。
- Metro：8087（8081 被 VMware 占用），日志 `SmallOKR_App/android/build/metro.log`。
- Android 调试偏好使用 `127.0.0.1:8081`；通过 `adb reverse tcp:8081 tcp:8087` 连接 Metro。
- 客户端本地环境使用 `.env.local`，启动 Metro 前设置 `$env:APP_ENV='local'`。
- Windows hosts 的 `10.89.0.201 alisa.docker.local` 不会被 Android 模拟器继承。模拟器当前不能解析该域名；用户接口联调仍需提供 Android 可用的 DNS/域名解析方式。
- traceservice 的本地 `.env` 基于 targetservice 的连接配置，数据库为 SQL 对应的 `db_trace`。

## AVD 已还原

按用户要求撤回本次 AVD 调优。保留原 `SmallOKR_API_36`（Google Play 镜像），内存恢复 `2G`，CPU 保持原有 4 核，GPU 恢复原 `enabled=no / mode=auto`，快速启动配置保持原值。蓝牙已重新开启。自定义模拟器启动脚本已删除；从 Android Studio 的 Device Manager 正常启动即可。

新增 root AVD 与 Google APIs 镜像已删除。未清除原 AVD 的应用数据。最初完整运行快照没有备份，因此配置还原不等同于完整运行状态回滚。

Debug 客户端仍包含开发根证书与域名定向解析：`alisa.docker.local` → `10.89.0.201`；HTTPS 域名及证书校验正常保留。此配置属于客户端，不修改模拟器系统、hosts 或 root 权限。

按用户要求，故障 SmallOKR_API_36 已删除并使用现有 Android 36 Google Play x86_64 镜像、Pixel 7 默认配置全新重建。旧 AVD 应用与登录数据已清除，未复用旧快照或手动调优配置。新实例以默认参数启动。
