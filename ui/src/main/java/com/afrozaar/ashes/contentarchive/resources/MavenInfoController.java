package com.afrozaar.ashes.contentarchive.resources;

import com.afrozaar.ashes.contentarchive.App;
import com.afrozaar.ashes.contentarchive.util.MavenInfo;

import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import java.io.PrintWriter;
import java.io.StringWriter;

@Component
@Path("/maven-info")
public class MavenInfoController {

    @GET
    public Response get() {
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);

        stringWriter.write("----- Maven Properties -----\n");
        MavenInfo.getMavenProperties(App.MAVEN_POM_PROPERTIES).ifPresent(properties -> properties.list(writer));
        stringWriter.write("----------------------------");

        return Response.ok(stringWriter.toString()).build();
    }
}
