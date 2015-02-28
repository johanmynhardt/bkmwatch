package za.co.johanmynhardt.bkmwatch.service.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.derby.jdbc.EmbeddedDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;

import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * @author johan
 */
@Configuration
@EnableWebMvc
@ComponentScan("za.co.johanmynhardt.bkmwatch")
public class Config extends WebMvcConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(Config.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/index.html").addResourceLocations("/");
        registry.addResourceHandler("/**").addResourceLocations("/");
        registry.addResourceHandler("/bower_components/**").addResourceLocations("/bower_components/");
    }

    @Bean
    public PropertySourcesPlaceholderConfigurer myProperties() {
        Resource resource = new ClassPathResource("/application.properties");
        final PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        propertySourcesPlaceholderConfigurer.setLocation(resource);
        return propertySourcesPlaceholderConfigurer;
    }

    /*@Bean
    public DataSource getDataSource(@Value("${dbUrl}") String dbUrl) {

        try {
            Class.forName("org.apache.derby.jdbc.ClientDriver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        DataSource dataSource = new DriverManagerDataSource(dbUrl);
        LOG.debug("Set up dataSource for dbUrl={}", dbUrl);
        return dataSource;
    }*/

    @Bean(destroyMethod = "shutdown")
    public DataSource getDataSource(@Value("${dbUrl}") String dbUrl) {

        try {
            Class.forName("org.apache.derby.jdbc.EmbeddedConnectionPoolDataSource");
            DriverManager.registerDriver(new EmbeddedDriver());
        } catch (ClassNotFoundException | SQLException e) {
            throw new RuntimeException(e);
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(dbUrl);
        config.setDriverClassName("org.apache.derby.jdbc.EmbeddedConnectionPoolDataSource");

        return new HikariDataSource(config);
    }

    @Bean
    public JdbcTemplate getJdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

}
