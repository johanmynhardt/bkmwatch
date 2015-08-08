package za.co.johanmynhardt.bkmwatch.service.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.parser.PatrollerAlertParser;
import za.co.johanmynhardt.bkmwatch.service.PatrollerAlertPoller;

import javax.inject.Inject;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;
import java.util.List;
import java.util.Map;
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
        KeyHolder keyHolder = new GeneratedKeyHolder();

        template.update(con -> {
            final PreparedStatement preparedStatement = con.prepareStatement("INSERT INTO ALERT_RECORD (DATE, MESSAGE) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS);
            preparedStatement.setDate(1, new java.sql.Date(date.getTime()));
            preparedStatement.setString(2, message);
            return preparedStatement;
        }, keyHolder);

        final int key = keyHolder.getKey().intValue();
        return getRecord(key);
    }

    private PatrollerAlertRecord createRecord(PatrollerAlertRecord record) {
        return createRecord(record.getDate(), record.getMessage());
    }

    @Override
    public PatrollerAlertRecord getRecord(int id) {
        return template.queryForObject(
                "SELECT * FROM ALERT_RECORD WHERE ID = ?",
                new Object[] { id },
                (rs, rowNum) -> {
                    return mapResultSetToRecord(rs);
                }
        );
    }

    @Override
    public List<PatrollerAlertRecord> getAllRecords(int page, int itemsPerPage, boolean update) throws IOException {

        LOG.trace("Retrieving ALL records from DB.");

        if (update) {
            populateDatabase();
        }

        // TODO: Optimise how paging is done. This is very inefficient!
        final List<PatrollerAlertRecord> records = this.getAllRecords();

        return returnPageFromResults(records, page, itemsPerPage);
    }

    public List<PatrollerAlertRecord> getAllRecords() {

        return template.queryForList("SELECT ID, DATE, MESSAGE FROM ALERT_RECORD ORDER BY DATE DESC")
                .stream()
                .map(this::mapRowToRecord)
                .collect(Collectors.toList());
    }

    @Override
    public List<PatrollerAlertRecord> search(String search) {
        LOG.debug("Searching for {}", search);
        return template.queryForList("SELECT DATE, MESSAGE FROM ALERT_RECORD WHERE MESSAGE LIKE ?", String.format("%%%s%%", search))
                .stream()
                .map(this::mapRowToRecord)
                .collect(Collectors.toList());
    }

    private PatrollerAlertRecord mapResultSetToRecord(ResultSet rs) throws SQLException {
        PatrollerAlertRecord record = new PatrollerAlertRecord();
        record.setId(rs.getInt("ID"));
        record.setDate(new Date(rs.getDate("DATE").getTime()));
        record.setMessage(rs.getString("MESSAGE"));
        return record;
    }

    private PatrollerAlertRecord mapRowToRecord(Map<String, Object> row) {
        PatrollerAlertRecord record = new PatrollerAlertRecord((Date) row.get("DATE"), (String) row.get("MESSAGE"));
        record.setId((Integer) row.get("ID"));
        return record;
    }

    @Override
    public boolean contains(PatrollerAlertRecord record) {
        return template.queryForObject(
                "SELECT count(*) AS COUNT FROM ALERT_RECORD WHERE DATE = ? AND MESSAGE = ?",
                new Object[] { new java.sql.Date(record.getDate().getTime()), record.getMessage() },
                (rs, rowNum) -> rs.getInt(1) > 0
        );
    }

    public long count() {
        return template.queryForObject("SELECT COUNT(*) FROM ALERT_RECORD", Long.class);
    }

    public void populateDatabase() {
        int page = 0;
        int max = 650;

        do {

            try {
                PatrollerAlertParser.AlertPageResult pageResult = poller.pollUrl(baseUrl + ("?pagenum=" + ++page));

                LOG.debug("page results = " + pageResult.getRecords().size());

                int count = 0;

                for (PatrollerAlertRecord record : pageResult.getRecords()) {
                    if (!contains(record)) {
                        createRecord(record);
                        count++;
                    }
                }

                if (count <= 0) {
                    return;
                }

            } catch (IOException e) {
                LOG.error("Error", e);
            }

        } while (page < max);
    }

}
