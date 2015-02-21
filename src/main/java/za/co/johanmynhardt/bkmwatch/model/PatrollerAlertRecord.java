package za.co.johanmynhardt.bkmwatch.model;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author johan
 */
public class PatrollerAlertRecord implements Serializable,  Comparable<PatrollerAlertRecord> {

    private static final long serialVersionUID = -3023663488377075259L;
    private Date date;
    private String message;

    public PatrollerAlertRecord() {
    }

    public PatrollerAlertRecord(Date date, String message) {
        this.date = date;
        this.message = message;
    }

    @Override
    public int compareTo(PatrollerAlertRecord o) {
        return o.date.compareTo(this.date);
    }

    private static final SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static PatrollerAlertRecord fromLine(String line) {
        String[] recordFields = line.split(": ", 3);

        if (recordFields.length != 3) {
            return null;
        }

        Date date = null;
        try {
            date = SIMPLE_DATE_FORMAT.parse(recordFields[1]);
        } catch (ParseException e) {
            org.slf4j.LoggerFactory.getLogger(PatrollerAlertRecord.class).error("Error", e);
        }

        return new PatrollerAlertRecord(date, recordFields[2]);
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "PatrollerAlertRecord{" +
                "date=" + date +
                ", message='" + message + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        PatrollerAlertRecord that = (PatrollerAlertRecord) o;

        if (date != null ? !date.equals(that.date) : that.date != null)
            return false;
        if (message != null ? !message.equals(that.message) : that.message != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = date != null ? date.hashCode() : 0;
        result = 31 * result + (message != null ? message.hashCode() : 0);
        return result;
    }
}
