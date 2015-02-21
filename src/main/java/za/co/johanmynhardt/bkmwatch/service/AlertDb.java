package za.co.johanmynhardt.bkmwatch.service;

import org.springframework.stereotype.Service;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * @author johan
 */
@Service
public class AlertDb {

    public List<PatrollerAlertRecord> getAllRecords() {
        return Arrays.asList(new PatrollerAlertRecord(new Date(), "ping"));
    }
}
