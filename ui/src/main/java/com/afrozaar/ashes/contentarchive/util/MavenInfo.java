package com.afrozaar.ashes.contentarchive.util;

import com.afrozaar.ashes.contentarchive.App;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Optional;
import java.util.Properties;

public class MavenInfo {

    private static final Logger LOG = LoggerFactory.getLogger(MavenInfo.class);

    public static Optional<Properties> getMavenProperties(final String location) {
        try {
            Properties properties = new Properties();
            properties.load(App.class.getResourceAsStream(location));
            return Optional.of(properties);
        } catch (IOException | NullPointerException e) {
            LOG.error("Error Loading Maven Properties from location '{}' (OK if this is development) ", location, e);
            return Optional.empty();
        }
    }
}
