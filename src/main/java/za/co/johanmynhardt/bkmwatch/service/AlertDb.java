package za.co.johanmynhardt.bkmwatch.service;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.parser.PatrollerAlertParser;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author johan
 */
@Service
public class AlertDb {

    Set<PatrollerAlertRecord> backingSet = Sets.newLinkedHashSet();

    private static final Logger LOG = LoggerFactory.getLogger(AlertDb.class);
    @Value("${resourceFile}")
    private String fileName = "/home/johan/bkmwatch2";

    @Value("${baseUrl}")
    String baseUrl;

    @Autowired
    private PatrollerAlertPoller poller;

    public List<PatrollerAlertRecord> getAllRecords(int page, int itemsPerPage, boolean update) throws IOException, ClassNotFoundException {
        int start = page * itemsPerPage;
        int end = start + itemsPerPage;
        LOG.debug("Returning from {} to {} (page={}, itemsPerPage={}, update={})", start, end, page, itemsPerPage, update);

        updateBacking(update);

        return Lists.newArrayList(backingSet).subList(start, backingSet.size() > end ? end : backingSet.size());
    }

    private void updateBacking(boolean update) throws IOException, ClassNotFoundException {
        if (backingSet.isEmpty() || update) {
            if (update) {
                final PatrollerAlertParser.AlertPageResult pageResult = poller.pollUrl(baseUrl);

                for (PatrollerAlertRecord patrollerAlertRecord : pageResult.getRecords()) {
                    LOG.trace("retrieved record={}", patrollerAlertRecord);
                }

                if (!backingSet.containsAll(pageResult.getRecords())) {
                    final Sets.SetView<PatrollerAlertRecord> difference = Sets.difference(pageResult.getRecords(), backingSet);
                    if (difference.size() > 5) {
                        System.out.println("New records: " + difference.size());
                    } else {
                        System.out.println("New records: " + difference);
                    }
                    backingSet.addAll(pageResult.getRecords());
                    saveBackingSet(backingSet);
                }
            }
            readExistingList(true);
        }
    }

    @SuppressWarnings("unchecked")
    private Set<PatrollerAlertRecord> readExistingList(boolean update) throws IOException, ClassNotFoundException {

        if (update) {
            File file = new File(fileName);

            LOG.debug("reading records from file={}", file);

            if (file.exists()) {
                ObjectInputStream inputStream = new ObjectInputStream(new FileInputStream(file));
                Object object = inputStream.readObject();
                Set<PatrollerAlertRecord> setFromObject = (Set<PatrollerAlertRecord>) object;
                backingSet.clear();
                backingSet.addAll(setFromObject);
            }
        }

        return new LinkedHashSet<>(backingSet);
    }

    private void saveBackingSet(Set<PatrollerAlertRecord> records) throws IOException {
        try (ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(new File(fileName)))) {
            objectOutputStream.writeObject(records);
            System.out.println("Wrote " + fileName);
        }
    }

    public List<PatrollerAlertRecord> search(String search) {
        LOG.debug("Searching for key={}", search);
        final List<PatrollerAlertRecord> collect = backingSet.stream()
                .filter((item) -> item.getMessage() != null)
                .filter((item) -> item.getMessage().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
        LOG.debug("found {} results for {}", collect.size(), search);
        return collect.size() < 100 ? collect : collect.subList(0, 100);
    }
}
