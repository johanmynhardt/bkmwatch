FROM java:8-alpine
MAINTAINER "Johan Mynhardt <johan.mynhardt@gmail.com>"
VOLUME /tmp
ADD ashes-content-archive.jar app.jar
RUN sh -c 'touch /app.jar'
ENTRYPOINT ["java", "-XX:+UseG1GC","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
