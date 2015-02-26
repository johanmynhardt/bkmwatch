package za.co.johanmynhardt.bkmwatch.service.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.service.repository.AlertDb;

import javax.inject.Inject;
import javax.inject.Named;

import java.io.IOException;
import java.util.List;

/**
 * @author johan
 */
@RestController
@RequestMapping("record")
public class RecordRest {

    private static final Logger LOG = LoggerFactory.getLogger(RecordRest.class);
    @Inject
    @Named("alertDbDerbyImpl")
    private AlertDb alertDb;

    @RequestMapping("ping")
    public String ping() {

        return "pong!";
    }

    @RequestMapping("alerts")
    public List<PatrollerAlertRecord> getAlerts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int itemsPerPage,
            @RequestParam(defaultValue = "false") boolean update) throws IOException, ClassNotFoundException {

        return alertDb.getAllRecords(page, itemsPerPage, update);
    }

    @RequestMapping("search")
    public List<PatrollerAlertRecord> searchAlerts(@RequestParam String search) {
        return alertDb.search(search);
    }
}
