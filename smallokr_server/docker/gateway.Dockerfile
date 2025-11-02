FROM openjdk:17-jdk-slim
WORKDIR /app
COPY ./target/package/gateway-*.jar /app/gateway.jar
EXPOSE 8080
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java", "-jar", "/app/gateway.jar"]
