package za.co.johanmynhardt.bkmwatch.service;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * @author johan
 */
@Service
public class AlertDb {

    Set<PatrollerAlertRecord> backingSet = Sets.newLinkedHashSet();

    private static final Logger LOG = LoggerFactory.getLogger(AlertDb.class);
    @Value("${resourceFile}")
    private String fileName = "/home/johan/bkmwatch2";

    public List<PatrollerAlertRecord> getAllRecords(int page, int itemsPerPage, boolean update) throws IOException, ClassNotFoundException {
        int start = page*itemsPerPage;
        int end = start + itemsPerPage;
        LOG.debug("Returning from {} to {} (page={}, itemsPerPage={}, update={})", start, end, page, itemsPerPage, update);

        if (backingSet.isEmpty() || update) {
            readExistingList(true);
        }

        return Lists.newArrayList(backingSet).subList(start, backingSet.size() > end ? end : backingSet.size());
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
}
