package za.co.johanmynhardt.bkmwatch.service.repository;

import com.google.common.collect.Sets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.parser.PatrollerAlertParser;
import za.co.johanmynhardt.bkmwatch.service.PatrollerAlertPoller;

import javax.inject.Inject;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author johan
 */
@Service
public class AlertDbDerbyImpl extends AbstractDb implements AlertDb {

    private static final Logger LOG = LoggerFactory.getLogger(AlertDbDerbyImpl.class);

    @Value("${baseUrl}")
    private String baseUrl;

    @Inject
    private PatrollerAlertPoller poller;

    @Inject
    private JdbcTemplate template;

    @Override
    public PatrollerAlertRecord createRecord(Date date, String message) {

        template.update(con -> {
            final PreparedStatement statement = con.prepareStatement("INSERT INTO ALERT_RECORD (DATE, MESSAGE) VALUES (?, ?)");

            statement.setDate(1, new java.sql.Date(date.getTime()));
            statement.setString(2, message);

            return statement;
        });

        final PatrollerAlertRecord record = new PatrollerAlertRecord(date, message);
        LOG.debug("created record={}", record);

        return record;
    }

    private PatrollerAlertRecord createRecord(PatrollerAlertRecord record) {
        return createRecord(record.getDate(), record.getMessage());
    }

    @Override
    public List<PatrollerAlertRecord> getAllRecords(int page, int itemsPerPage, boolean update) throws IOException {

        LOG.trace("Retrieving ALL records from DB.");

        if (update) {
            populateDatabase();
        }

        final List<PatrollerAlertRecord> records = this.getAllRecords();

        return returnPageFromResults(records, page, itemsPerPage);
    }

    List<PatrollerAlertRecord> getAllRecords() {

        return template.queryForList("SELECT DATE, MESSAGE FROM ALERT_RECORD")
                    .stream()
                    .map((row) -> new PatrollerAlertRecord((Date) row.get("DATE"), (String) row.get("MESSAGE")))
                    .collect(Collectors.toList());
    }

    @Override
    public List<PatrollerAlertRecord> search(String search) {
        LOG.debug("Searching for {}", search);
        return template.queryForList("SELECT DATE, MESSAGE FROM ALERT_RECORD WHERE MESSAGE like ?", String.format("%%%s%%", search))
                .stream()
                .map((row) -> new PatrollerAlertRecord((Date) row.get("DATE"), (String)row.get("MESSAGE")))
                .collect(Collectors.toList());
    }

    public long count() {
        return template.queryForObject("SELECT COUNT(*) FROM ALERT_RECORD", Long.class);
    }



    public void populateDatabase() {
        int page = -1;
        int max = 622;

        do {

            try {
                PatrollerAlertParser.AlertPageResult pageResult = poller.pollUrl(baseUrl + ("?pagenum=" + ++page));
                //max = pageResult.links.stream().filter((link)->{link.text.contains("last")}).map((link)->link.)

                LOG.debug("page results = " + pageResult.getRecords().size());

                if (getAllRecords().containsAll(pageResult.getRecords())) {
                    LOG.debug("No new records found.");
                    return;
                } else {
                    final Sets.SetView<PatrollerAlertRecord> difference = Sets.difference(pageResult.getRecords(), Sets.newTreeSet(getAllRecords()));
                    if (difference.size() > 5) {
                        LOG.info("New records: {}", difference.size());
                    } else {
                        LOG.info("New records: {}", difference);
                    }

                    for (PatrollerAlertRecord record : pageResult.getRecords()) {
                        createRecord(record);
                    }
                }
            } catch (IOException e) {
                LOG.error("Error", e);
            }

        } while (page < max);
    }

}
