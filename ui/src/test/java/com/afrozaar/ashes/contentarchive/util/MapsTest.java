package com.afrozaar.ashes.contentarchive.util;

import static org.junit.Assert.assertThat;

import com.google.common.collect.ImmutableMap;

import org.hamcrest.Matchers;
import org.junit.Test;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

/**
 * @author johan
 */
public class MapsTest {

    @Test
    public void get() {
        final ImmutableMap<String, String> expected = ImmutableMap.of("key", "value");
        final ImmutableMap<String, Serializable> map = ImmutableMap.of(
                "name", "pietie",
                "items", ImmutableMap.of(
                        "foo", Arrays.asList(1, 2),
                        "barbar", expected
                )
        );

        final Object o = Maps.get(map, "items.barbar");
        assertThat(o, Matchers.equalTo(expected));

        final String name = (String) Maps.get(map, "name");
        assertThat(name, Matchers.equalTo("pietie"));

        List list = Arrays.asList(1, 2);

        final List list2 = (List) Maps.get(map, "items.foo");
        assertThat(list2, Matchers.equalTo(list));

        final Object rand = Maps.get(map, "rand");
        assertThat(rand, Matchers.equalTo(null));

        final Object itemsBar = Maps.get(map, "items.bar");
        assertThat(itemsBar, Matchers.equalTo(null));

        final Object itemsBarbar3 = Maps.get(map, "items.barbar.3");
        assertThat(itemsBarbar3, Matchers.equalTo(null));
    }
}