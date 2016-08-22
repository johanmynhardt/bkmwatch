package com.afrozaar.ashes.contentarchive;

import static org.assertj.core.api.Assertions.fail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.client.RestTemplate;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = App.class)
public class AppTestIT {

    private static final Logger LOG = LoggerFactory.getLogger(AppTestIT.class);
    @Autowired
    private RestTemplate restTemplate;

    @Test
    public void contextLoads() {
        final String base = "http://localhost:8080";
        final String file = "ping";
        String[] contexts = {
                "/public",
                "/static",
                "/static/txt",
                "",
                "/resources",
                "/META-INF/resources"
        };

        final String[] foundAt = {null};

        Arrays.stream(contexts).forEach(context -> {
            if (!found(foundAt)) {
                final String url = base + context + "/" + file;
                try {
                    final String response = restTemplate.getForObject(url, String.class);
                    LOG.info("FOUND AT: {}", url);
                    foundAt[0] = response;
                } catch (Exception e) {
                    LOG.warn("Error pinging {}", url, e);
                }
            }
        });

        if (foundAt[0] == null) {
            fail("File not found at any context.");
        }
    }

    private boolean found(String[] found) {
        return found[0] != null;
    }
}
