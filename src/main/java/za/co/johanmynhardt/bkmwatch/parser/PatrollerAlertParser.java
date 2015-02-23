package za.co.johanmynhardt.bkmwatch.parser;

import com.google.common.base.Preconditions;

import org.springframework.stereotype.Component;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;

import za.co.johanmynhardt.bkmwatch.model.PatrollerAlertRecord;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

/**
 * @author johan
 */
@Component
public class PatrollerAlertParser {

    public static class AlertPageResult {
        Set<PatrollerAlertRecord> records;
        List<Link> links = new ArrayList<>();

        public static class Link {
            String text;
            String uri;

            public Link(String text, String uri) {
                this.text = text;
                this.uri = uri;
            }

            @Override
            public String toString() {
                return "Link{" +
                        "text='" + text + '\'' +
                        ", uri='" + uri + '\'' +
                        '}';
            }

            public static Link fromLine(Element element) {
                return new Link(element.text(), element.attr("href"));
            }
        }

        public Set<PatrollerAlertRecord> getRecords() {
            return records;
        }

        @Override
        public String toString() {
            return "AlertPageResult{" +
                    "links=" + links +
                    ", records=" + records +
                    '}';
        }
    }

    public AlertPageResult parse(InputStream inputStream) throws IOException {

        Preconditions.checkNotNull(inputStream);

        /*BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

        String line;*/

        AlertPageResult pageResult = new AlertPageResult();

        pageResult.records = parseThroughJsoup(inputStream);

        /*while ((line = reader.readLine()) != null) {
            if (line.contains("Date:")) {
                pageResult.records = parseRecords(line);
            }
            if (line.contains("href=")) {
                pageResult.links.addAll(parseLinks(line));;
            }
        }*/
        return pageResult;
    }

    private TreeSet<PatrollerAlertRecord> parseRecords(String recordContents) {

        return Arrays.asList(recordContents.split("<hr>"))
                .stream().filter((item) -> item.contains("Date"))
                .map(String::trim)
                .map((item) -> Jsoup.parse(item).text())
                .map(PatrollerAlertRecord::fromLine)
                .filter((item)-> item != null)
                .collect(Collectors.toCollection(TreeSet::new));
    }

    private TreeSet<PatrollerAlertRecord> parseThroughJsoup(InputStream inputStream) throws IOException {
        final String parsedResult = Jsoup.parse(inputStream, "utf-8", "").text().replaceAll("\\s+", " ");
        final String toUse = parsedResult.substring(parsedResult.indexOf("Date: "), parsedResult.lastIndexOf("--Page"));

        return Arrays.asList(toUse.split("Date: "))
                .stream()
                .filter((it) -> it != null && !it.isEmpty())
                .map(PatrollerAlertRecord::fromLine0)
                .filter((ite) -> ite != null)
                .collect(Collectors.toCollection(TreeSet::new));
    }

    private List<AlertPageResult.Link> parseLinks(String content) {
        return Jsoup.parse(content).getElementsByTag("a")
                .stream()
                .map(AlertPageResult.Link::fromLine)
                .collect(Collectors.toList());
    }
}
