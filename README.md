# SmallOKR
一个非常简单的个人目标管理软件

账号认证和公共网关由同级 alisa-cloud 项目提供：alisa-user 注册名为 user-service，接口仍为 /api/v1/user/**。
SmallOKR 服务端仅构建 targetservice、todoservice、traceservice；公共库先在 alisa-cloud 执行 mvn clean install。
业务网关路由见 smallokr_server/gateway-routes.yml，切换指南见 alisa-cloud/docs/user-service-migration.md。

## Development
需要提前配置一下服务器环境，建议服务器选择 **Ubuntu 24.04** ，以下各个基础设施的**安装部分**仅列出作者的一种方式，完全可以用自己的方式
- Docker
- MySQL
- Redis
- Nacos
### Docker
可以参考官网的安装 ：https://docs.docker.com/engine/install
### MySQL Installation And Configuration
```sh
mkdir ~/MySQL
cd ~/MySQL
nano docker-compose.yml # 将下面docker-compose.yml 内容复制进来,注意要修改下用户名和密码
docker compose up -d
```

docker-compose.yml 内容如下
```yml
services:
  mysql:
    image: mysql:8.0
    container_name: mysql
    restart: always             
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: smallokr
      MYSQL_USER: one
      MYSQL_PASSWORD: "password"
    ports:
      - "3306:3306"
    volumes:
      - ./mysql/data:/var/lib/mysql
      - ./mysql/conf:/etc/mysql/conf.d
    command:
      --default-authentication-plugin=mysql_native_password
      --bind-address=0.0.0.0 
    networks:
      - my_network

networks:
  my_network:
```


sql文件在./smallokr_server/sql 目录下，可以用 Navicat等工具连接数据库后，执行相关脚本，创建数据库

### Redis Installation And Configuration
```sh
mkdir ~/Redis
cd ~/Redis
nano docker-compose.yml # 将下面docker-compose.yml 内容复制进来,注意要修改下用户名和密码
docker compose up -d
```

docker-compose.yml 内容如下
```yml
services:
  redis:
    image: redis:latest
    container_name: myredis
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    volumes:
      - ./myredis/conf:/usr/local/etc/redis
    ports:
      - "6379:6379"
    restart: always
```
### Nacos Installation And COnfiguration
```sh
git clone https://github.com/nacos-group/nacos-docker.git
cd nacos-docker
docker-compose -f example/standalone-derby.yaml up
```

### SmallOKR Server Devloyment
```sh
git clone https://github.com/sunyuboalisa/SmallOKR.git
cd SmallOKR/smallokr_server
# 先按 alisa-cloud 的说明部署公共账号服务和网关，使用相同的 Nacos 和 JWT_SECRET。
# 为公共网关设置 ALISA_GATEWAY_ROUTES_FILE，指向本项目 smallokr_server/gateway-routes.yml。
# 两个项目共享已创建的 my_network 网络。

# 将 ./smallokr_server/targetservice/example.env 复制进去并修改相关变量
cp targetservice/example.env targetservice.env 
nano targetservice.env

# 将 ./smallokr_server/todoservice/example.env 复制进去并修改相关变量
cp todoservice/example.env todoservice.env
nano todoservice.env 

# 将 ./smallokr_server/traceservice/example.env 复制进去并修改相关变量
cp traceservice/example.env traceservice.env
nano traceservice.env

# 运行
docker compose up -d

```

业务服务通过 alisa-cloud 网关提供通信，网关默认端口为 8100。本项目不再独立部署 gateway 和 userservice。




