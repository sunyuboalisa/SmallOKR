# 默认服务与公司命名空间
SERVICE ?= targetservice
COMPANY ?= alisa
REGISTRY ?= 

# 自动判断操作系统，Windows 下使用 mvn，Linux/macOS 也使用 mvn（如有需要可自行改成 ./mvnw）
ifeq ($(OS),Windows_NT)
    MVN_CMD = mvn
else
    MVN_CMD = mvn
endif

MODULE = $(SERVICE)

# 常量定义
DOCKERFILE_PATH = docker/$(SERVICE).Dockerfile

# 生产环境完整的镜像名称
ifeq ($(REGISTRY),)
    IMAGE_NAME = $(COMPANY)/smallokr-$(SERVICE)
else
    IMAGE_NAME = $(REGISTRY)/$(COMPANY)/smallokr-$(SERVICE)
endif
IMAGE_TAG = latest

.PHONY: package-single build clean-image build-target build-todo build-trace build-user build-all

# 1. 精准打包
package-single:
	@echo "====> [Maven] 正在精准打包子模块: $(MODULE) ..."
	$(MVN_CMD) clean package -pl $(MODULE) -am -DskipTests

# 2. 仅构建镜像
build-only:
	@echo "====> [Podman] 正在构建镜像 $(IMAGE_NAME):$(IMAGE_TAG) ..."
	podman build -f $(DOCKERFILE_PATH) -t $(IMAGE_NAME):$(IMAGE_TAG) .

# 3. 完整构建流水线
build: package-single build-only

# 4. 清理指定服务的旧镜像
clean-image:
	@echo "====> [Podman] 正在删除旧镜像 $(IMAGE_NAME):$(IMAGE_TAG) ..."
	-podman rmi $(IMAGE_NAME):$(IMAGE_TAG)

# ================= 🚀 快捷构建入口 =================
build-target:
	@$(MAKE) build SERVICE=targetservice

build-todo:
	@$(MAKE) build SERVICE=todoservice

build-trace:
	@$(MAKE) build SERVICE=traceservice

build-user:
	@$(MAKE) build SERVICE=userservice

# ================= 🌪️ 安全并发一键打包 =================
# 在 Windows 下，将多目标拆分到独立的 MAKE 命令中执行，彻底避免 CreateProcess 报错
build-all:
	@$(MAKE) -j 1 build-target
	@$(MAKE) -j 1 build-todo
	@$(MAKE) -j 1 build-trace
	@$(MAKE) -j 1 build-user

# ================= 🚢 生产部署一键推送 =================

# 一键推送所有镜像到云端仓库
push-all:
	podman push $(REGISTRY)/$(COMPANY)/gateway:$(IMAGE_TAG)

# 终极省心指令：一键完成「全量打包、全量构建、全量推送」
release-all: build-all push-all