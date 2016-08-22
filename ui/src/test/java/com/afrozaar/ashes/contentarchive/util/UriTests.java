package com.afrozaar.ashes.contentarchive.util;

import com.google.common.collect.ImmutableMap;

import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import org.junit.Test;

import java.net.URI;
import java.util.Map;

/**
 * @author johan
 */
public class UriTests {

    @Test
    public void test() {
        String hostPattern = "http://{domain}:{port}/support/{apiLevel}/{tenantKey}/{appId}/search?titleKey={titleKey}&datasetKey={datasetKey}&type={type}&term={term}";

        Map<String, Object> params = new ImmutableMap.Builder<String, Object>()
                .put("domain", "localhost")
                .put("port", 8080)
                .put("apiLevel", 9)
                .put("tenantKey", "sbp")
                .put("appId", 6)
                .put("titleKey", "cont")
                .put("datasetKey", "RICHJSON")
                .put("type", "content")
                .put("term", "hello").build();

        final UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(hostPattern).buildAndExpand(params);

        final URI uri = uriComponents.toUri();

        System.out.println("uri = " + uri);
    }
}
