FROM eclipse-temurin:17-jre
WORKDIR /app
COPY ./target/package/targetservice-*.jar /app/targetservice.jar
EXPOSE 8081
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java", "-jar", "/app/targetservice.jar"]
