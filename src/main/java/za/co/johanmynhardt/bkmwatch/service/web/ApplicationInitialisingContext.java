package za.co.johanmynhardt.bkmwatch.service.web;

import org.springframework.stereotype.Component;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.LoggerFactory;

import javax.annotation.PreDestroy;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import javax.sql.DataSource;

import java.util.Timer;

/**
 * @author johan
 */
@Component
public class ApplicationInitialisingContext implements WebApplicationInitializer {

    private static final org.slf4j.Logger LOG = LoggerFactory.getLogger(ApplicationInitialisingContext.class);
    Timer timer = new Timer("Eskom-Poll", false);

    @Override
    public void onStartup(javax.servlet.ServletContext servletContext) throws ServletException {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(Config.class);
        ctx.setServletContext(servletContext);

        ctx.refresh();

        final ServletRegistration.Dynamic dispatcher = servletContext.addServlet("dispatcher", new DispatcherServlet(ctx));

        dispatcher.addMapping("/");
        dispatcher.setLoadOnStartup(1);

        LOG.debug("onStartup servletContext={}", servletContext);

        //timer.scheduleAtFixedRate(new CheckStateTask(), 0L, TimeUnit.MINUTES.toMillis(5));
    }

    @PreDestroy
    public void cleanup() {
        LOG.info("Shutting down");

        timer.cancel();
        timer.purge();
        timer = null;
    }

}
