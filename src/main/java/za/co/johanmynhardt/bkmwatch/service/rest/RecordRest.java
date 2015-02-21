package za.co.johanmynhardt.bkmwatch.service.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.service.AlertDb;

import java.util.List;

/**
 * @author johan
 */
@RestController
@RequestMapping("record")
public class RecordRest {

    private static final Logger LOG = LoggerFactory.getLogger(RecordRest.class);
    @Autowired
    private AlertDb alertDb;

    @RequestMapping("ping")
    public String ping() {

        return "pong!";
    }

    @RequestMapping("alerts")
    public List<PatrollerAlertRecord> getAlerts() {

        LOG.debug("retrieving all records...");
        return alertDb.getAllRecords();
    }
}
