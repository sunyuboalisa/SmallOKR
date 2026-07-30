FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY ./target/package/traceservice-*.jar /app/traceservice.jar
EXPOSE 8083
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java", "-jar", "/app/traceservice.jar"]
