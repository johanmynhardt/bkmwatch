package com.afrozaar.ashes.contentarchive.resources;

import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Component
@Path("/search")
public class SearchProxyController {

    private static final Logger LOG = LoggerFactory.getLogger(SearchProxyController.class);

    @GET
    public Response get() {
        LOG.debug("GET /search");
        return Response.ok().build();
    }
}
