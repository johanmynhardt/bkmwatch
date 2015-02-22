package za.co.johanmynhardt.bkmwatch.service.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author johan
 */
@Configuration
@EnableWebMvc
@ComponentScan("za.co.johanmynhardt.bkmwatch")
public class Config extends WebMvcConfigurerAdapter {

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


}