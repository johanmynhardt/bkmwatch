package za.co.johanmynhardt.bkmwatch.parser;

import com.google.common.collect.Sets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import org.junit.Test;
import org.junit.runner.RunWith;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.service.PatrollerAlertPoller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Set;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@ComponentScan(basePackages = { "za.co.johanmynhardt.bkmwatch" })
public class PatrollerAlertParserTest {

    @Configuration
    static class ContextConfiguration {
        @Bean
        public PatrollerAlertPoller getPoller() {
            return new PatrollerAlertPoller();
        }

        @Bean
        public PatrollerAlertParser getParser() {
            return new PatrollerAlertParser();
        }
    }

    @Autowired
    private PatrollerAlertPoller poller;

    @SuppressWarnings("unchecked")
    @org.junit.Test
    public void testParse() throws Exception {

        File file = new File("/home/johan/bkmwatch");

        final String baseUrl = "http://bkmwatch.org.za/mobile/PatrollerAlerts.php";
        int page = 0;
        int max = 2;

        do {
            Set<PatrollerAlertRecord> records = readExistingList(file);
            System.out.println("records = " + records.size());

            PatrollerAlertParser.AlertPageResult pageResult = poller.pollUrl(baseUrl+("?pagenum="+ ++page));
            //max = pageResult.links.stream().filter((link)->{link.text.contains("last")}).map((link)->link.)

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
}