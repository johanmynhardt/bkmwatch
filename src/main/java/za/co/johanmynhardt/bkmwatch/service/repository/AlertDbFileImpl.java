package za.co.johanmynhardt.bkmwatch.service.repository;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;
import za.co.johanmynhardt.bkmwatch.parser.PatrollerAlertParser;
import za.co.johanmynhardt.bkmwatch.service.PatrollerAlertPoller;

import javax.inject.Inject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author johan
 */
@Service
public class AlertDbFileImpl extends AbstractDb implements AlertDb {

    Set<PatrollerAlertRecord> backingSet = Sets.newLinkedHashSet();

    private static final Logger LOG = LoggerFactory.getLogger(AlertDbFileImpl.class);
    @Value("${resourceFile}")
    private String fileName = "/home/johan/bkmwatch2";

    @Value("${baseUrl}")
    String baseUrl;

    @Inject
    private PatrollerAlertPoller poller;

    @Override
    public List<PatrollerAlertRecord> getAllRecords(int page, int itemsPerPage, boolean update) throws IOException {

        try {
            updateBacking(update);
        } catch (ClassNotFoundException e) {
            LOG.error("Error", e);
        }

        return returnPageFromResults(Lists.newArrayList(backingSet), page, itemsPerPage);
    }

    @Override
    public PatrollerAlertRecord getRecord(int id) {
        throw new UnsupportedOperationException();
    }

    @Override
    public PatrollerAlertRecord createRecord(Date date, String message) {
        throw new UnsupportedOperationException("Not Implemented");
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
            LOG.debug("Wrote " + fileName);
        }
    }

    @Override
    public List<PatrollerAlertRecord> search(String search) {
        LOG.debug("Searching for key={}", search);
        final List<PatrollerAlertRecord> collect = backingSet.stream()
                .filter((item) -> item.getMessage() != null)
                .filter((item) -> item.getMessage().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
        LOG.debug("found {} results for {}", collect.size(), search);
        return collect.size() < 100 ? collect : collect.subList(0, 100);
    }

    @Override
    public boolean contains(PatrollerAlertRecord record) {
        return false;
    }
}
