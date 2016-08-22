package com.afrozaar.ashes.contentarchive.config;

import com.afrozaar.ashes.contentarchive.resources.MavenInfoController;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("/rest")
@Component
public class JerseyConfig extends ResourceConfig {

    @Bean
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

    public JerseyConfig() {
        //register(SearchProxyController.class);
        register(MavenInfoController.class);
    }
}
