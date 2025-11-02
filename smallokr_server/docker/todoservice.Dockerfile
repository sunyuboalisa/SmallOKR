FROM openjdk:17-jdk-slim
WORKDIR /app
COPY ./target/package/todoservice-*.jar /app/todoservice.jar
EXPOSE 8082
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java", "-jar", "/app/todoservice.jar"]
