package za.co.johanmynhardt.bkmwatch.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.parser.PatrollerAlertParser;

import java.io.IOException;
import java.net.URL;

/**
 * @author johan
 */
@Service
public class PatrollerAlertPoller {

    private static final Logger LOG = LoggerFactory.getLogger(PatrollerAlertPoller.class);
    @Autowired
    private PatrollerAlertParser parser;

    public PatrollerAlertParser.AlertPageResult pollUrl(String url) throws IOException {
        LOG.debug("polling url = " + url);

        final PatrollerAlertParser.AlertPageResult result = parser.parse(new URL(url).openStream());
        return result;
    }
}
