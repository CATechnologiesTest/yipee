FROM openjdk:jre-alpine
COPY target/uberjar/converter-0.1.0-SNAPSHOT-standalone.jar /
COPY schemata /schemata
CMD ["java", "-jar", "/converter-0.1.0-SNAPSHOT-standalone.jar"]

