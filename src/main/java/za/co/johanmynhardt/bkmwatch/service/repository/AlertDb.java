package za.co.johanmynhardt.bkmwatch.service.repository;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;

import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * @author johan
 */
public interface AlertDb {

    PatrollerAlertRecord createRecord(Date date, String message);

    List<PatrollerAlertRecord> getAllRecords(int page, int itemsPerPage, boolean update) throws IOException;

    PatrollerAlertRecord getRecord(int id);

    List<PatrollerAlertRecord> search(String search);

    boolean contains(PatrollerAlertRecord record);
}
