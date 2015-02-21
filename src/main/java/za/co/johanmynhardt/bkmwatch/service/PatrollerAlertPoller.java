package za.co.johanmynhardt.bkmwatch.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import za.co.johanmynhardt.bkmwatch.parser.PatrollerAlertParser;

import java.io.IOException;
import java.net.URL;

/**
 * @author johan
 */
@Service
public class PatrollerAlertPoller {

    @Autowired
    private PatrollerAlertParser parser;

    public PatrollerAlertParser.AlertPageResult pollUrl(String url) throws IOException {
        System.out.println("polling url = " + url);

        final PatrollerAlertParser.AlertPageResult result = parser.parse(new URL(url).openStream());
        return result;
    }
}
