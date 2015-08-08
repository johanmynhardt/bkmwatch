package za.co.johanmynhardt.bkmwatch.parser;

import static org.junit.Assert.*;

import com.google.common.collect.Sets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.service.PatrollerAlertPoller;
import za.co.johanmynhardt.bkmwatch.service.repository.AlertDb;
import za.co.johanmynhardt.bkmwatch.service.repository.AlertDbDerbyImpl;
import za.co.johanmynhardt.bkmwatch.service.repository.AlertDbFileImpl;

import javax.inject.Inject;
import javax.inject.Named;
import javax.sql.DataSource;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ComponentScan(basePackages = { "za.co.johanmynhardt.bkmwatch" })
public class PatrollerAlertParserTest {

    private static final Logger LOG = LoggerFactory.getLogger(PatrollerAlertParserTest.class);

    @Configuration
    static class ContextConfiguration {
        private static final Logger LOG = LoggerFactory.getLogger(ContextConfiguration.class);

        @Bean
        public PatrollerAlertPoller getPoller() {
            return new PatrollerAlertPoller();
        }

        @Bean
        public PatrollerAlertParser getParser() {
            return new PatrollerAlertParser();
        }

        @Bean
        public PropertySourcesPlaceholderConfigurer myProperties() {
            Resource resource = new ClassPathResource("/application.properties");
            final PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
            propertySourcesPlaceholderConfigurer.setLocation(resource);
            return propertySourcesPlaceholderConfigurer;
        }

        @Bean(name = "alertDbDerbyImpl")
        public AlertDb getAlertDb() {
            return new AlertDbDerbyImpl();
        }

        @Bean(name = "alertDbFileImpl")
        public AlertDb getAlertDbFile() {
            return new AlertDbFileImpl();
        }

        @Bean
        public DataSource getDataSource(@Value("${dbUrl}") String dbUrl) {
            DataSource dataSource = new DriverManagerDataSource(dbUrl);
            LOG.debug("Set up dataSource for dbUrl={}", dbUrl);
            return dataSource;
        }

        @Bean
        public JdbcTemplate getJdbcTemplate(DataSource dataSource) {
            return new JdbcTemplate(dataSource);
        }
    }

    @Inject
    private PatrollerAlertPoller poller;

    @Inject
    private PatrollerAlertParser parser;

    @Inject
    //@Named("alertDbDerbyImpl")
    private AlertDbDerbyImpl alertDb;

    @Inject
    @Named("alertDbFileImpl")
    private AlertDb alertDbFile;

    @Value("${resourceFile}")
    String resourceFile;

    @Value("${baseUrl}")
    String baseUrl;

    @SuppressWarnings("unchecked")
    @org.junit.Test
    public void testParse() throws Exception {

        File file = new File("/home/johan/bkmwatch");

        final String baseUrl = this.baseUrl;
        int page = -1;
        int max = 622;

        do {
            Set<PatrollerAlertRecord> records = readExistingList(file);
            System.out.println("records = " + records.size());

            PatrollerAlertParser.AlertPageResult pageResult = poller.pollUrl(baseUrl + ("?pagenum=" + ++page));
            //max = pageResult.links.stream().filter((link)->{link.text.contains("last")}).map((link)->link.)

            System.out.println("page results = " + pageResult.records.size());

            if (records.containsAll(pageResult.records)) {
                System.out.println("No new records found.");
            } else {
                final Sets.SetView<PatrollerAlertRecord> difference = Sets.difference(pageResult.records, records);
                if (difference.size() > 5) {
                    System.out.println("New records: " + difference.size());
                } else {
                    System.out.println("New records: " + difference);
                }
                records.addAll(pageResult.records);
                writeExistingList(file, records);
            }

        } while (page < max);
    }

    @Test
    public void Parse() throws IOException {
        final PatrollerAlertParser.AlertPageResult parse = parser.parse(PatrollerAlertParserTest.class.getResourceAsStream("/html/PatrollerAlerts.html"));

        System.out.println("parse = " + parse.records.size());
    }

    private Set<PatrollerAlertRecord> readExistingList(File file) throws IOException, ClassNotFoundException {
        if (file.exists()) {
            ObjectInputStream inputStream = new ObjectInputStream(new FileInputStream(file));
            Object object = inputStream.readObject();

            return (Set<PatrollerAlertRecord>) object;
        }

        return Sets.<PatrollerAlertRecord>newTreeSet();
    }

    private void writeExistingList(File file, Set<PatrollerAlertRecord> records) throws IOException {
        try (ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(file))) {
            objectOutputStream.writeObject(records);
            System.out.println("Wrote " + file);
        }
    }

    @Test
    public void ReadList() throws IOException, ClassNotFoundException {
        File file = new File("/home/johan/bkmwatch");
        Set<PatrollerAlertRecord> records = readExistingList(file);

        for (PatrollerAlertRecord record : records) {
            System.out.println(record.toString());
        }
    }

    @Test
    public void AlertDb() throws IOException, ClassNotFoundException {
        final List<PatrollerAlertRecord> allDbRecords = alertDb.getAllRecords();

        System.out.println("allDbRecords = " + allDbRecords.size());

        Set<PatrollerAlertRecord> set = new HashSet<>(allDbRecords);

        System.out.println("set = " + set.size());

        /*long count = alertDb.count();

        System.out.println("count = " + count);*/
    }

    //@Test
    public void importLocal() throws IOException {
        int page = 0;

        List<PatrollerAlertRecord> allRecords;

        while (!(allRecords = alertDbFile.getAllRecords(page++, 20, false)).isEmpty() && allRecords.size() > 0) {
            LOG.debug("allRecords(page={})={}", page, allRecords.size());

            for (PatrollerAlertRecord allRecord : allRecords) {
                alertDb.createRecord(allRecord.getDate(), allRecord.getMessage());
            }
        }

    }

    @Test
    public void Insert2IdenticalRecords() {
        Date date = new Date();

        String message = "This is a message";

        final PatrollerAlertRecord record = alertDb.createRecord(date, message);

        LOG.debug("record created = {}", record);

        PatrollerAlertRecord patrollerAlertRecord = new PatrollerAlertRecord(date, message);

        final boolean contains = alertDb.contains(patrollerAlertRecord);

        assertEquals(true, contains);

        boolean contains2 = alertDb.contains(new PatrollerAlertRecord(date, "aoeu"));

        assertEquals(false, contains2);
    }

    @Test
    public void PopulateDb() {
        ((AlertDbDerbyImpl) alertDb).populateDatabase();
    }
}