FROM openjdk:17-ea-17-jdk-slim
WORKDIR /app
COPY ./target/package/userservice-*.jar /app/userservice.jar
EXPOSE 8084
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java", "-jar", "/app/userservice.jar"]
