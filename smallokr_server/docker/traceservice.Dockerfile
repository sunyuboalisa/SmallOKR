FROM openjdk:17-ea-17-jdk-slim
WORKDIR /app
COPY ./target/package/traceservice-*.jar /app/traceservice.jar
EXPOSE 8083
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java", "-jar", "/app/traceservice.jar"]
