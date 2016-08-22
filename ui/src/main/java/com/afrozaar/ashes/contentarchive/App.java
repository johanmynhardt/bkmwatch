package com.afrozaar.ashes.contentarchive;

import com.afrozaar.ashes.contentarchive.config.WebConfig;
import com.afrozaar.ashes.contentarchive.util.MavenInfo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@EnableAutoConfiguration
@SpringBootApplication
public class App extends SpringBootServletInitializer {

    private static final Logger LOG = LoggerFactory.getLogger(App.class);
    public static final String MAVEN_POM_PROPERTIES = "/META-INF/maven/com.afrozaar.ashes/ashes-content-archive/pom.properties";

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(App.class, WebConfig.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);

        MavenInfo.getMavenProperties(MAVEN_POM_PROPERTIES).ifPresent(properties -> {
            LOG.info("----- Maven Properties -----");
            properties.entrySet().forEach(entry -> LOG.info("{}: {}", entry.getKey(), entry.getValue()));
            LOG.info("----------------------------");
        });

        LOG.info("*** Compost STARTED!");
    }
}
