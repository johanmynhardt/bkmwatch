package za.co.johanmynhardt.bkmwatch.service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;

import javax.inject.Inject;
import javax.sql.DataSource;

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
    @Inject
    private DataSource dataSource;

    @Inject
    private JdbcTemplate jdbcTemplate;

    @Override
    public PatrollerAlertRecord createRecord(Date date, String message) {

        JdbcTemplate template = new JdbcTemplate(dataSource);

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

    @Override
    public List<PatrollerAlertRecord> getAllRecords(int page, int itemsPerPage, boolean update) throws IOException {
        JdbcTemplate template = new JdbcTemplate(dataSource);

        LOG.debug("Retrieving ALL records from DB.");

        final List<PatrollerAlertRecord> records = template.queryForList("SELECT DATE, MESSAGE FROM ALERT_RECORD")
                .stream()
                .map((row) -> new PatrollerAlertRecord((Date) row.get("DATE"), (String) row.get("MESSAGE")))
                .collect(Collectors.toList());

        return returnPageFromResults(records, page, itemsPerPage);
    }

    @Override
    public List<PatrollerAlertRecord> search(String search) {
        return null;
    }

    public long count() {
        return new JdbcTemplate(dataSource).queryForObject("SELECT COUNT(*) FROM ALERT_RECORD", Long.class);
    }

}
