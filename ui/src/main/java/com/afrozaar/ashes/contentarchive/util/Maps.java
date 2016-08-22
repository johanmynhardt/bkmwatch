package com.afrozaar.ashes.contentarchive.util;

import java.util.Arrays;
import java.util.Map;

public class Maps {
    public static Object get(Map map, String... path) {
        if (path.length == 0) {
            return map;
        } else {
            final Object o = map.get(path[0]);
            if (o instanceof Map) {
                return get((Map) o, Arrays.copyOfRange(path, 1, path.length));
            } else {
                return o;
            }
        }
    }

    public static Object get(Map map, String pathPec) {
        return get(map, pathPec.split("\\."));
    }
}
