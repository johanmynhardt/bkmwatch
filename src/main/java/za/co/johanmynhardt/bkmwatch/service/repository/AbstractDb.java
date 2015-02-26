package za.co.johanmynhardt.bkmwatch.service.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;

import java.util.Collections;
import java.util.List;

/**
 * @author johan
 */
public class AbstractDb {

    private static final Logger LOG = LoggerFactory.getLogger(AbstractDb.class);

    protected List<PatrollerAlertRecord> returnPageFromResults(List<PatrollerAlertRecord> source, int page, int itemsPerPage) {
        int start = page * itemsPerPage;
        int end = start + itemsPerPage;

        LOG.debug("Requesting {} items per page at page {} from {} source items.", itemsPerPage, page, source.size());

        if (start > source.size()) {
            return Collections.emptyList();
        }

        LOG.debug("Returning from {} to {} (page={}, itemsPerPage={})", start, end, page, itemsPerPage);
        return source.subList(start, source.size() > end ? end : source.size());

    }
}
