'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g

  var app = document.querySelector('#app');

  /* Create instance of axios so we don't need to set config everywhere. */
  var httpClient;
  HTMLImports.whenReady(function () {
    httpClient = axios.create({
      withCredentials: true
    });
  });

  /** DB containers */
  app.db = {
    titles: [],
    titleEditions: {},
    sections: [],
    titleSections: {}
  };

  app.lookup = {};

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {} // if production
  // Uncomment app.baseURL below and
  // set app.baseURL to '/your-pathname/' if running from folder in production
  // app.baseUrl = '/polymer-starter-kit/';


  /** DEFAULT app config.
   *
   * @type {{searchBase: string, apiL: number, tk: string, appId: number}}
   */
  app.config = {
    searchBase: 'http://localhost:8080/ashes-support',
    contentBase: 'http://localhost:8080/ashes-web',
    apiL: 9,
    tk: 'noTenantKey',
    appId: -1
  };

  app.displayInstalledToast = function () {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  app.normalizeLimitToType = function (config) {
    if (_.has(config, 'limitToType')) {
      var types = _.split(config.limitToType, ',').map(function (x) {
        return _.startsWith(x, 'type-') ? x : 'type-' + x;
      });

      config.limitToType = _.join(types, ',');
    }
  };

  app.parseParams = function (queryString) {
    return _.chain(queryString.split('&')).map(function (param) {
      var p = param.split('=', 2);
      return [p[0], decodeURIComponent(p[1])];
    }).value();
  };

  /**
   *  Parse configuration from URL parameters. It will only signal the config when all
   *  the expected keys are present.
   */
  app.parseConfigFromQueryString = function (queryString) {
    console.info('parse config from queryString: ', queryString);
    if (queryString.length > 0) {
      var params;

      var _ret = function () {
        var validKeys = ['appId', 'irsBase', 'searchBase', 'tk'];
        var optionalKeys = ['launch', 'limitToType', 'contentBase', 'contextLabel', 'multiSelect', 'context'];
        params = {};


        var hasSupportedKey = function hasSupportedKey(supportedKeys, keyToVerify) {
          return _.find(supportedKeys, function (key) {
            return _.isEqual(key, keyToVerify);
          });
        };

        var parsedParams = _.chain(queryString.split('&')).map(function (param) {
          var p = param.split('=', 2);
          return [p[0], decodeURIComponent(p[1])];
        }).value();

        parsedParams.forEach(function (param) {
          var pKey = _.head(param);
          var pVal = param[1];
          if (hasSupportedKey(validKeys, pKey) || hasSupportedKey(optionalKeys, pKey)) {
            params[pKey] = pVal;
          }
        });

        if (_.keys(params).length < validKeys.length) {
          console.error('Can not create config object. Missing keys: expected %o, got %o', validKeys, _.keys(params));
          return {
            v: {
              error: 'Missing expected keys: ' + validKeys + ' but got ' + _.keys(params)
            }
          };
        } else {
          params.apiL = 9;
          params.standalone = true;
          console.info('config from url params: ', params);

          /* This is a hack to make it work on Safari... NFI why this is not working otherwise.*/
          // setTimeout(function() {
          //   app.fire('iron-signal', {name: 'config-from-url', data: params});
          // }, 100);
          return {
            v: params
          };
        }
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  };

  app.saveConfig = function (seedConfig) {

    var setOptionalKey = function setOptionalKey(map, key, value) {
      if (_.isUndefined(value) || _.isNull(value)) {
        console.warn('not setting key \'%s\' on map as value is undefined/null.', key);
      } else {
        if (_.isBoolean(value) || _.includes(['true', 'false'], value)) {
          map[key] = value === true || value === 'true';
        } else {
          map[key] = value;
        }
      }
    };

    var prependWith = function prependWith(prefix) {
      return function (value) {
        return _.startsWith(value, prefix) ? value : prefix + value;
      };
    };

    var parseLimitToType = function parseLimitToType(limitToType) {
      if (_.isUndefined(limitToType) || _.isNull(limitToType)) {
        return undefined;
      } else {
        return _.chain(limitToType).split(',').map(prependWith('type-')).join(',').value();
      }
    };

    var toSave = {
      searchBase: seedConfig.searchBase,
      contentBase: seedConfig.contentBase,
      tk: seedConfig.tk,
      appId: seedConfig.appId,
      apiL: seedConfig.apiL,
      irsBase: seedConfig.irsBase
    };

    setOptionalKey(toSave, 'limitToType', parseLimitToType(seedConfig.limitToType));
    setOptionalKey(toSave, 'contextLabel', seedConfig.contextLabel);
    setOptionalKey(toSave, 'multiSelect', seedConfig.multiSelect);
    setOptionalKey(toSave, 'context', seedConfig.context);
    setOptionalKey(toSave, 'standalone', seedConfig.standalone);
    setOptionalKey(toSave, 'embedded', !seedConfig.standalone);

    console.log('storing config: ', toSave);

    app.config = toSave;

    this.fire('iron-signal', {
      name: 'config-updated',
      data: toSave
    });
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function () {
    console.log('Our app is ready to rock!');

    // ask for configuration.
    if (window.opener) {
      var message = JSON.stringify({ request: 'config' });
      if (message) {
        console.info('asking for config: %s', message);
        window.opener.postMessage(message, '*');
      } else {
        console.warn('no value to send.');
      }
    } else {
      console.warn('Can not send message. Window has no opener. Assuming STANDALONE mode.');

      //console.info('About to parse config from query string, using location: ', location);

      //app.parseConfigFromQueryString(location.search.slice(1));
    }
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function () {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  // window.addEventListener('paper-header-transform', function(e) {
  // var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
  // var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
  // var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
  // var detail = e.detail;
  // var heightDiff = detail.height - detail.condensedHeight;
  // var yRatio = Math.min(1, detail.y / heightDiff);
  // appName max size when condensed. The smaller the number the smaller the condensed size.
  // var maxMiddleScale = 0.50;
  // var auxHeight = heightDiff - detail.y;
  // var auxScale = heightDiff / (1 - maxMiddleScale);
  // var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
  // var scaleBottom = 1 - yRatio;

  // Move/translate middleContainer
  // Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

  // Scale bottomContainer and bottom sub title to nothing and back
  // Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

  // Scale middleContainer appName
  // Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  // });

  window.addEventListener('message', function (event) {
    if (event.data) {
      var data = JSON.parse(event.data);

      if (data.config) {
        console.info('config received: ', data.config);
        app.normalizeLimitToType(data.config);
        app.saveConfig(data.config);
      }
    }
  });

  window.addEventListener('iron-signal', function (event) {
    if (_.isEqual('config-updated', event.detail.name)) {

      app.bootstrap.fetchTitles();
    }
  });

  app.bootstrap = {

    baseSearchTemplate: '{searchBase}/support/{apiL}/{tk}/{appId}/search',
    baseLookupTemplate: '{searchBase}/support/{apiL}/{tk}/{appId}/lookup',
    baseContentTemplate: '{contentBase}/content-api/content/1/{tk}/{appId}',
    baseIrsMetaTemplate: '{irsBase}/1/meta',
    //http://localhost:8080/ashes-web/content-api/content/1/sbp/8/title
    urlTitle: '/title',
    urlEditions: '/title/{titleId}/editions',
    pathurlSections: '/title/{titleId}/editions/{editionId}/sections',
    media: '/media',

    withPath: function withPath(path) {
      return app.bootstrap.baseContentTemplate + path;
    },

    fetchTitles: function fetchTitles() {
      var templateUrl = app.bootstrap.withPath(app.bootstrap.urlTitle);

      httpClient.get(app.urlFromConfig(app.config, templateUrl)).then(function (response) {
        var forLabel = function forLabel(title) {
          return _.extend({ label: title.title }, title);
        };

        app.db.titles = _.map(response.data, forLabel);
      }).catch(function (error) {
        app.showToast('Could not fetch titles. See console for info. ({error})', {
          error: error
        }, true);
      });
    },

    fetchEditions: function fetchEditions(title) {

      var idsHavingTitleName = function idsHavingTitleName(titles, title) {
        return _.map(_.filter(titles, { label: title.label }), 'id');
      };

      _.each(idsHavingTitleName(app.db.titles, title), function (titleId) {
        if (_.isUndefined(app.db.titleEditions[titleId])) {
          console.info('Updating sections for title with id: ', titleId);
          var templateUrl = app.bootstrap.withPath(app.bootstrap.urlEditions);
          var config = app.extendConfig({ titleId: titleId });

          httpClient.get(app.urlFromConfig(config, templateUrl)).then(function (response) {
            console.info('titleEdition (%s) result: ', title.label, _.map(response.data, function (edition) {
              return _.template('id: {id}, name: {name}')(edition);
            }));

            app.db.titleEditions[title.id] = response.data;

            _.each(response.data, function (edition) {
              app.bootstrap.fetchSections(title, edition);
            });
          }).catch(function (error) {
            app.showToast('Could not update editions. {}', error, true);
          });
        }
      });
    },

    fetchSections: function fetchSections(title, edition) {
      var templateSection = app.bootstrap.withPath(app.bootstrap.pathurlSections);
      var config = app.extendConfig({ titleId: title.id, editionId: edition.id });

      httpClient.get(app.urlFromConfig(config, templateSection)).then(function (response) {
        console.log('got sections for title(%s), edition(%s): ', title.id, edition.id, response.data);

        var updateSection = function updateSection(section) {
          if (!_.includes(app.db.sections, section)) {
            app.db.sections.push(section);

            if (!_.isEmpty(section.sections)) {
              console.log('recursing for %s with sections: ', section.label, _.map(section.sections, 'label'));
              _.each(section.sections, updateSection);
            }
          }
        };

        _.each(response.data, updateSection);
      }).catch(function (error) {
        console.error('failed to update sections for title(%s) edition(%s): ', title.id, edition.id, error);
      });
    }
  };

  app.extendConfig = function (extension) {
    return _.extend(extension, app.config);
  };

  app.urlFromConfig = function (config, template) {
    if (_.has(config, 'searchBase')) {
      return _.template(template)(config);
    } else {
      console.warn('Can\'t stamp template \'%s\' for config.', template);
      return undefined;
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function () {
    app.$.headerPanelMain.scrollToTop(true);
  };

  /*   app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  }; */

  app.goHome = function () {
    if (app.config.standalone) {
      page.redirect(app.baseUrl);
    } else {
      page.redirect('/search');
    }
  };

  app.sendToInitiator = function (requestName, dataKey, data) {

    if (_.isUndefined(data) || _.isEmpty(data)) {
      app.showToast('Please ensure that a selection exist before inserting.');
      return null;
    }

    if (window.opener) {

      var response = {};

      response.request = requestName;
      response[dataKey] = data;

      var message = JSON.stringify(response);
      if (message) {
        console.info('sending selected: %s', message);
        try {
          window.opener.postMessage(message, '*');
        } catch (e) {
          console.error('Can not return message.', e);
        }
      } else {
        app.showToast('No value to send.', {}, true);
      }
    } else {
      app.showToast('Can not send message. Window has no opener.', {}, true);
    }
  };

  app.goToIndex = function () {
    page.redirect(app.baseUrl);
  };

  app.goToLookup = function () {
    var input = document.querySelector('paper-input#lookupKey');
    var contentKey = _.trim(input.value);

    if (_.isEmpty(contentKey)) {
      app.showToast('No content key provided.', {}, true);
    } else {
      input.value = '';
      app.$.lookupDialog.close();
      page.redirect('/article/' + contentKey);
    }
  };

  app.showToast = function (textOrTemplate, values, errorOrWarn) {
    var message = values ? _.template(textOrTemplate)(values) : textOrTemplate;
    if (errorOrWarn) {
      console.error('Error/warn toast:');
      console.trace(message);
    }
    app._showToast(app.$.toast, message);
  };

  app.showPermaToast = function (message) {
    app._showToast(app.$.permaToast, message);
  };

  app._showToast = function (node, message) {
    node.text = message;
    node.show();
  };

  app.multiValueUrl = function (template, configMap) {
    var mapForQueryString = _.extend({}, configMap);
    var base = _.template(template)(app.extendConfig(configMap));

    var joiner = function joiner(j) {
      return function (k, v) {
        return k + j + v;
      };
    };

    var queryKvJoin = function queryKvJoin(key) {
      return function (val) {
        return [key, encodeURIComponent(val)].reduce(joiner('='));
      };
    };

    var toKV = function toKV(param) {
      var k = param[0];
      var v = _.isArray(param[1]) ? param[1] : [param[1]];
      return _.map(v, queryKvJoin(k)).reduce(joiner('&'));
    };

    var buildQueryString = function buildQueryString(map) {
      return _.map(_.toPairs(map), toKV).reduce(joiner('&'));
    };

    return [base, buildQueryString(mapForQueryString)].reduce(joiner('?'));
  };

  app.lookup = function (contentKey, onSuccess, onErr) {
    var url = app.multiValueUrl(app.bootstrap.baseLookupTemplate, {
      contentKey: contentKey,
      datasetKey: 'forsearch',
      type: 'content'
    });

    axios.post(url, {}).then(onSuccess).catch(onErr);
  };
})(document);
//# sourceMappingURL=data:application/json;base64,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TixFQUFTLFlBQVksQ0FBWixDQUFULEVBQ0osTUFESSxDQUNHLE9BQU8sR0FBUCxDQURILENBQVA7QUFFRCxLQUxEOztBQU9BLFFBQU0sbUJBQW1CLFNBQW5CLGdCQUFtQixDQUFDLEdBQUQ7QUFBQSxhQUFTLEVBQUUsR0FBRixDQUFNLEVBQUUsT0FBRixDQUFVLEdBQVYsQ0FBTixFQUFzQixJQUF0QixFQUE0QixNQUE1QixDQUFtQyxPQUFPLEdBQVAsQ0FBbkMsQ0FBVDtBQUFBLEtBQXpCOztBQUVBLFdBQU8sQ0FBQyxJQUFELEVBQU8saUJBQWlCLGlCQUFqQixDQUFQLEVBQTRDLE1BQTVDLENBQW1ELE9BQU8sR0FBUCxDQUFuRCxDQUFQO0FBQ0QsR0FsQkQ7O0FBb0JBLE1BQUksTUFBSixHQUFhLFVBQVMsVUFBVCxFQUFxQixTQUFyQixFQUFnQyxLQUFoQyxFQUF1QztBQUNsRCxRQUFJLE1BQU0sSUFBSSxhQUFKLENBQWtCLElBQUksU0FBSixDQUFjLGtCQUFoQyxFQUFvRDtBQUM1RCxrQkFBWSxVQURnRDtBQUU1RCxrQkFBWSxXQUZnRDtBQUc1RCxZQUFNO0FBSHNELEtBQXBELENBQVY7O0FBTUEsVUFBTSxJQUFOLENBQVcsR0FBWCxFQUFnQixFQUFoQixFQUFvQixJQUFwQixDQUF5QixTQUF6QixFQUFvQyxLQUFwQyxDQUEwQyxLQUExQztBQUNELEdBUkQ7QUFVRCxDQXpkRCxFQXlkRyxRQXpkSCIsImZpbGUiOiJzY3JpcHRzL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTUgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuVGhpcyBjb2RlIG1heSBvbmx5IGJlIHVzZWQgdW5kZXIgdGhlIEJTRCBzdHlsZSBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcblRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxuQ29kZSBkaXN0cmlidXRlZCBieSBHb29nbGUgYXMgcGFydCBvZiB0aGUgcG9seW1lciBwcm9qZWN0IGlzIGFsc29cbnN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4qL1xuXG4oZnVuY3Rpb24oZG9jdW1lbnQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEdyYWIgYSByZWZlcmVuY2UgdG8gb3VyIGF1dG8tYmluZGluZyB0ZW1wbGF0ZVxuICAvLyBhbmQgZ2l2ZSBpdCBzb21lIGluaXRpYWwgYmluZGluZyB2YWx1ZXNcbiAgLy8gTGVhcm4gbW9yZSBhYm91dCBhdXRvLWJpbmRpbmcgdGVtcGxhdGVzIGF0IGh0dHA6Ly9nb28uZ2wvRHgxdTJnXG4gIHZhciBhcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyk7XG5cbiAgLyogQ3JlYXRlIGluc3RhbmNlIG9mIGF4aW9zIHNvIHdlIGRvbid0IG5lZWQgdG8gc2V0IGNvbmZpZyBldmVyeXdoZXJlLiAqL1xuICB2YXIgaHR0cENsaWVudDtcbiAgSFRNTEltcG9ydHMud2hlblJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIGh0dHBDbGllbnQgID0gYXhpb3MuY3JlYXRlKHtcbiAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxuICAgIH0pO1xuICB9KTtcblxuICAvKiogREIgY29udGFpbmVycyAqL1xuICBhcHAuZGIgPSB7XG4gICAgdGl0bGVzOiBbXSxcbiAgICB0aXRsZUVkaXRpb25zOiB7fSxcbiAgICBzZWN0aW9uczogW10sXG4gICAgdGl0bGVTZWN0aW9uczoge31cbiAgfTtcblxuICBhcHAubG9va3VwID0ge307XG5cbiAgLy8gU2V0cyBhcHAgZGVmYXVsdCBiYXNlIFVSTFxuICBhcHAuYmFzZVVybCA9ICcvJztcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wb3J0ID09PSAnJykgeyAgLy8gaWYgcHJvZHVjdGlvblxuICAgIC8vIFVuY29tbWVudCBhcHAuYmFzZVVSTCBiZWxvdyBhbmRcbiAgICAvLyBzZXQgYXBwLmJhc2VVUkwgdG8gJy95b3VyLXBhdGhuYW1lLycgaWYgcnVubmluZyBmcm9tIGZvbGRlciBpbiBwcm9kdWN0aW9uXG4gICAgLy8gYXBwLmJhc2VVcmwgPSAnL3BvbHltZXItc3RhcnRlci1raXQvJztcbiAgfVxuXG4gIC8qKiBERUZBVUxUIGFwcCBjb25maWcuXG4gICAqXG4gICAqIEB0eXBlIHt7c2VhcmNoQmFzZTogc3RyaW5nLCBhcGlMOiBudW1iZXIsIHRrOiBzdHJpbmcsIGFwcElkOiBudW1iZXJ9fVxuICAgKi9cbiAgYXBwLmNvbmZpZyA9IHtcbiAgICBzZWFyY2hCYXNlOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FzaGVzLXN1cHBvcnQnLFxuICAgIGNvbnRlbnRCYXNlOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FzaGVzLXdlYicsXG4gICAgYXBpTDogOSxcbiAgICB0azogJ25vVGVuYW50S2V5JyxcbiAgICBhcHBJZDogLTFcbiAgfTtcblxuICBhcHAuZGlzcGxheUluc3RhbGxlZFRvYXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIGNhY2hpbmcgaXMgYWN0dWFsbHkgZW5hYmxlZOKAlGl0IHdvbid0IGJlIGluIHRoZSBkZXYgZW52aXJvbm1lbnQuXG4gICAgaWYgKCFQb2x5bWVyLmRvbShkb2N1bWVudCkucXVlcnlTZWxlY3RvcigncGxhdGludW0tc3ctY2FjaGUnKS5kaXNhYmxlZCkge1xuICAgICAgUG9seW1lci5kb20oZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IoJyNjYWNoaW5nLWNvbXBsZXRlJykuc2hvdygpO1xuICAgIH1cbiAgfTtcblxuICBhcHAubm9ybWFsaXplTGltaXRUb1R5cGUgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgICBpZiAoXy5oYXMoY29uZmlnLCAnbGltaXRUb1R5cGUnKSkge1xuICAgICAgbGV0IHR5cGVzID0gXy5zcGxpdChjb25maWcubGltaXRUb1R5cGUsICcsJykubWFwKCh4KSA9PiB7XG4gICAgICAgIHJldHVybiBfLnN0YXJ0c1dpdGgoeCwgJ3R5cGUtJykgPyB4IDogJ3R5cGUtJyArIHg7XG4gICAgICB9KTtcblxuICAgICAgY29uZmlnLmxpbWl0VG9UeXBlID0gXy5qb2luKHR5cGVzLCAnLCcpO1xuICAgIH1cbiAgfTtcblxuICBhcHAucGFyc2VQYXJhbXMgPSAocXVlcnlTdHJpbmcpID0+IHtcbiAgICByZXR1cm4gXy5jaGFpbihxdWVyeVN0cmluZy5zcGxpdCgnJicpKVxuICAgICAgLm1hcCgocGFyYW0pID0+IHtcbiAgICAgICAgY29uc3QgcCA9IHBhcmFtLnNwbGl0KCc9JywgMik7XG4gICAgICAgIHJldHVybiBbcFswXSwgZGVjb2RlVVJJQ29tcG9uZW50KHBbMV0pXTtcbiAgICAgIH0pLnZhbHVlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqICBQYXJzZSBjb25maWd1cmF0aW9uIGZyb20gVVJMIHBhcmFtZXRlcnMuIEl0IHdpbGwgb25seSBzaWduYWwgdGhlIGNvbmZpZyB3aGVuIGFsbFxuICAgKiAgdGhlIGV4cGVjdGVkIGtleXMgYXJlIHByZXNlbnQuXG4gICAqL1xuICBhcHAucGFyc2VDb25maWdGcm9tUXVlcnlTdHJpbmcgPSBmdW5jdGlvbihxdWVyeVN0cmluZykge1xuICAgIGNvbnNvbGUuaW5mbygncGFyc2UgY29uZmlnIGZyb20gcXVlcnlTdHJpbmc6ICcsIHF1ZXJ5U3RyaW5nKTtcbiAgICBpZiAocXVlcnlTdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHZhbGlkS2V5cyA9IFsnYXBwSWQnLCAnaXJzQmFzZScsICdzZWFyY2hCYXNlJywgJ3RrJ107XG4gICAgICBsZXQgb3B0aW9uYWxLZXlzID0gW1xuICAgICAgICAnbGF1bmNoJyxcbiAgICAgICAgJ2xpbWl0VG9UeXBlJyxcbiAgICAgICAgJ2NvbnRlbnRCYXNlJyxcbiAgICAgICAgJ2NvbnRleHRMYWJlbCcsXG4gICAgICAgICdtdWx0aVNlbGVjdCcsXG4gICAgICAgICdjb250ZXh0J1xuICAgICAgXTtcbiAgICAgIHZhciBwYXJhbXMgPSB7fTtcblxuICAgICAgbGV0IGhhc1N1cHBvcnRlZEtleSA9IChzdXBwb3J0ZWRLZXlzLCBrZXlUb1ZlcmlmeSkgPT4ge1xuICAgICAgICByZXR1cm4gXy5maW5kKHN1cHBvcnRlZEtleXMsIChrZXkpID0+IF8uaXNFcXVhbChrZXksIGtleVRvVmVyaWZ5KSk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgcGFyc2VkUGFyYW1zID0gXy5jaGFpbihxdWVyeVN0cmluZy5zcGxpdCgnJicpKVxuICAgICAgICAubWFwKChwYXJhbSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHAgPSBwYXJhbS5zcGxpdCgnPScsIDIpO1xuICAgICAgICAgIHJldHVybiBbcFswXSwgZGVjb2RlVVJJQ29tcG9uZW50KHBbMV0pXTtcbiAgICAgICAgfSkudmFsdWUoKTtcblxuICAgICAgcGFyc2VkUGFyYW1zLmZvckVhY2goKHBhcmFtKSA9PiB7XG4gICAgICAgIGxldCBwS2V5ID0gXy5oZWFkKHBhcmFtKTtcbiAgICAgICAgbGV0IHBWYWwgPSBwYXJhbVsxXTtcbiAgICAgICAgaWYgKGhhc1N1cHBvcnRlZEtleSh2YWxpZEtleXMsIHBLZXkpIHx8IGhhc1N1cHBvcnRlZEtleShvcHRpb25hbEtleXMsIHBLZXkpKSB7XG4gICAgICAgICAgcGFyYW1zW3BLZXldID0gcFZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChfLmtleXMocGFyYW1zKS5sZW5ndGggPCB2YWxpZEtleXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhbiBub3QgY3JlYXRlIGNvbmZpZyBvYmplY3QuIE1pc3Npbmcga2V5czogZXhwZWN0ZWQgJW8sIGdvdCAlbycsXG4gICAgICAgICAgICAgICAgICAgICAgdmFsaWRLZXlzLCBfLmtleXMocGFyYW1zKSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6ICdNaXNzaW5nIGV4cGVjdGVkIGtleXM6ICcgKyB2YWxpZEtleXMgKyAnIGJ1dCBnb3QgJyArIF8ua2V5cyhwYXJhbXMpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMuYXBpTCA9IDk7XG4gICAgICAgIHBhcmFtcy5zdGFuZGFsb25lID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdjb25maWcgZnJvbSB1cmwgcGFyYW1zOiAnLCBwYXJhbXMpO1xuXG4gICAgICAgIC8qIFRoaXMgaXMgYSBoYWNrIHRvIG1ha2UgaXQgd29yayBvbiBTYWZhcmkuLi4gTkZJIHdoeSB0aGlzIGlzIG5vdCB3b3JraW5nIG90aGVyd2lzZS4qL1xuICAgICAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgIGFwcC5maXJlKCdpcm9uLXNpZ25hbCcsIHtuYW1lOiAnY29uZmlnLWZyb20tdXJsJywgZGF0YTogcGFyYW1zfSk7XG4gICAgICAgIC8vIH0sIDEwMCk7XG4gICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGFwcC5zYXZlQ29uZmlnID0gZnVuY3Rpb24oc2VlZENvbmZpZykge1xuXG4gICAgY29uc3Qgc2V0T3B0aW9uYWxLZXkgPSAobWFwLCBrZXksIHZhbHVlKSA9PiB7XG4gICAgICBpZiAoXy5pc1VuZGVmaW5lZCh2YWx1ZSkgfHwgXy5pc051bGwodmFsdWUpKSB7XG4gICAgICAgIGNvbnNvbGUud2Fybignbm90IHNldHRpbmcga2V5IFxcJyVzXFwnIG9uIG1hcCBhcyB2YWx1ZSBpcyB1bmRlZmluZWQvbnVsbC4nLCBrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNCb29sZWFuKHZhbHVlKSB8fCBfLmluY2x1ZGVzKFsndHJ1ZScsICdmYWxzZSddLCB2YWx1ZSkpIHtcbiAgICAgICAgICBtYXBba2V5XSA9ICh2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHByZXBlbmRXaXRoID0gcHJlZml4ID0+IHZhbHVlID0+IF8uc3RhcnRzV2l0aCh2YWx1ZSwgcHJlZml4KSA/IHZhbHVlIDogcHJlZml4ICsgdmFsdWU7XG5cbiAgICBjb25zdCBwYXJzZUxpbWl0VG9UeXBlID0gKGxpbWl0VG9UeXBlKSA9PiB7XG4gICAgICBpZiAoXy5pc1VuZGVmaW5lZChsaW1pdFRvVHlwZSkgfHwgXy5pc051bGwobGltaXRUb1R5cGUpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXy5jaGFpbihsaW1pdFRvVHlwZSlcbiAgICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAgIC5tYXAocHJlcGVuZFdpdGgoJ3R5cGUtJykpXG4gICAgICAgICAgLmpvaW4oJywnKVxuICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdG9TYXZlID0ge1xuICAgICAgc2VhcmNoQmFzZTogc2VlZENvbmZpZy5zZWFyY2hCYXNlLFxuICAgICAgY29udGVudEJhc2U6IHNlZWRDb25maWcuY29udGVudEJhc2UsXG4gICAgICB0azogc2VlZENvbmZpZy50ayxcbiAgICAgIGFwcElkOiBzZWVkQ29uZmlnLmFwcElkLFxuICAgICAgYXBpTDogc2VlZENvbmZpZy5hcGlMLFxuICAgICAgaXJzQmFzZTogc2VlZENvbmZpZy5pcnNCYXNlXG4gICAgfTtcblxuICAgIHNldE9wdGlvbmFsS2V5KHRvU2F2ZSwgJ2xpbWl0VG9UeXBlJywgcGFyc2VMaW1pdFRvVHlwZShzZWVkQ29uZmlnLmxpbWl0VG9UeXBlKSk7XG4gICAgc2V0T3B0aW9uYWxLZXkodG9TYXZlLCAnY29udGV4dExhYmVsJywgc2VlZENvbmZpZy5jb250ZXh0TGFiZWwpO1xuICAgIHNldE9wdGlvbmFsS2V5KHRvU2F2ZSwgJ211bHRpU2VsZWN0Jywgc2VlZENvbmZpZy5tdWx0aVNlbGVjdCk7XG4gICAgc2V0T3B0aW9uYWxLZXkodG9TYXZlLCAnY29udGV4dCcsIHNlZWRDb25maWcuY29udGV4dCk7XG4gICAgc2V0T3B0aW9uYWxLZXkodG9TYXZlLCAnc3RhbmRhbG9uZScsIHNlZWRDb25maWcuc3RhbmRhbG9uZSk7XG4gICAgc2V0T3B0aW9uYWxLZXkodG9TYXZlLCAnZW1iZWRkZWQnLCAhc2VlZENvbmZpZy5zdGFuZGFsb25lKTtcblxuICAgIGNvbnNvbGUubG9nKCdzdG9yaW5nIGNvbmZpZzogJywgdG9TYXZlKTtcblxuICAgIGFwcC5jb25maWcgPSB0b1NhdmU7XG5cbiAgICB0aGlzLmZpcmUoJ2lyb24tc2lnbmFsJywge1xuICAgICAgbmFtZTogJ2NvbmZpZy11cGRhdGVkJyxcbiAgICAgIGRhdGE6IHRvU2F2ZVxuICAgIH0pO1xuICB9O1xuXG4gIC8vIExpc3RlbiBmb3IgdGVtcGxhdGUgYm91bmQgZXZlbnQgdG8ga25vdyB3aGVuIGJpbmRpbmdzXG4gIC8vIGhhdmUgcmVzb2x2ZWQgYW5kIGNvbnRlbnQgaGFzIGJlZW4gc3RhbXBlZCB0byB0aGUgcGFnZVxuICBhcHAuYWRkRXZlbnRMaXN0ZW5lcignZG9tLWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdPdXIgYXBwIGlzIHJlYWR5IHRvIHJvY2shJyk7XG5cbiAgICAvLyBhc2sgZm9yIGNvbmZpZ3VyYXRpb24uXG4gICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoe3JlcXVlc3Q6ICdjb25maWcnfSk7XG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJ2Fza2luZyBmb3IgY29uZmlnOiAlcycsIG1lc3NhZ2UpO1xuICAgICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKG1lc3NhZ2UsICcqJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ25vIHZhbHVlIHRvIHNlbmQuJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQ2FuIG5vdCBzZW5kIG1lc3NhZ2UuIFdpbmRvdyBoYXMgbm8gb3BlbmVyLiBBc3N1bWluZyBTVEFOREFMT05FIG1vZGUuJyk7XG5cbiAgICAgIC8vY29uc29sZS5pbmZvKCdBYm91dCB0byBwYXJzZSBjb25maWcgZnJvbSBxdWVyeSBzdHJpbmcsIHVzaW5nIGxvY2F0aW9uOiAnLCBsb2NhdGlvbik7XG5cbiAgICAgIC8vYXBwLnBhcnNlQ29uZmlnRnJvbVF1ZXJ5U3RyaW5nKGxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1BvbHltZXIvcG9seW1lci9pc3N1ZXMvMTM4MVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignV2ViQ29tcG9uZW50c1JlYWR5JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gaW1wb3J0cyBhcmUgbG9hZGVkIGFuZCBlbGVtZW50cyBoYXZlIGJlZW4gcmVnaXN0ZXJlZFxuICB9KTtcblxuICAvLyBNYWluIGFyZWEncyBwYXBlci1zY3JvbGwtaGVhZGVyLXBhbmVsIGN1c3RvbSBjb25kZW5zaW5nIHRyYW5zZm9ybWF0aW9uIG9mXG4gIC8vIHRoZSBhcHBOYW1lIGluIHRoZSBtaWRkbGUtY29udGFpbmVyIGFuZCB0aGUgYm90dG9tIHRpdGxlIGluIHRoZSBib3R0b20tY29udGFpbmVyLlxuICAvLyBUaGUgYXBwTmFtZSBpcyBtb3ZlZCB0byB0b3AgYW5kIHNocnVuayBvbiBjb25kZW5zaW5nLiBUaGUgYm90dG9tIHN1YiB0aXRsZVxuICAvLyBpcyBzaHJ1bmsgdG8gbm90aGluZyBvbiBjb25kZW5zaW5nLlxuICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFwZXItaGVhZGVyLXRyYW5zZm9ybScsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gdmFyIGFwcE5hbWUgPSBQb2x5bWVyLmRvbShkb2N1bWVudCkucXVlcnlTZWxlY3RvcignI21haW5Ub29sYmFyIC5hcHAtbmFtZScpO1xuICAvLyB2YXIgbWlkZGxlQ29udGFpbmVyID0gUG9seW1lci5kb20oZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IoJyNtYWluVG9vbGJhciAubWlkZGxlLWNvbnRhaW5lcicpO1xuICAvLyB2YXIgYm90dG9tQ29udGFpbmVyID0gUG9seW1lci5kb20oZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IoJyNtYWluVG9vbGJhciAuYm90dG9tLWNvbnRhaW5lcicpO1xuICAvLyB2YXIgZGV0YWlsID0gZS5kZXRhaWw7XG4gIC8vIHZhciBoZWlnaHREaWZmID0gZGV0YWlsLmhlaWdodCAtIGRldGFpbC5jb25kZW5zZWRIZWlnaHQ7XG4gIC8vIHZhciB5UmF0aW8gPSBNYXRoLm1pbigxLCBkZXRhaWwueSAvIGhlaWdodERpZmYpO1xuICAvLyBhcHBOYW1lIG1heCBzaXplIHdoZW4gY29uZGVuc2VkLiBUaGUgc21hbGxlciB0aGUgbnVtYmVyIHRoZSBzbWFsbGVyIHRoZSBjb25kZW5zZWQgc2l6ZS5cbiAgLy8gdmFyIG1heE1pZGRsZVNjYWxlID0gMC41MDtcbiAgLy8gdmFyIGF1eEhlaWdodCA9IGhlaWdodERpZmYgLSBkZXRhaWwueTtcbiAgLy8gdmFyIGF1eFNjYWxlID0gaGVpZ2h0RGlmZiAvICgxIC0gbWF4TWlkZGxlU2NhbGUpO1xuICAvLyB2YXIgc2NhbGVNaWRkbGUgPSBNYXRoLm1heChtYXhNaWRkbGVTY2FsZSwgYXV4SGVpZ2h0IC8gYXV4U2NhbGUgKyBtYXhNaWRkbGVTY2FsZSk7XG4gIC8vIHZhciBzY2FsZUJvdHRvbSA9IDEgLSB5UmF0aW87XG5cbiAgLy8gTW92ZS90cmFuc2xhdGUgbWlkZGxlQ29udGFpbmVyXG4gIC8vIFBvbHltZXIuQmFzZS50cmFuc2Zvcm0oJ3RyYW5zbGF0ZTNkKDAsJyArIHlSYXRpbyAqIDEwMCArICclLDApJywgbWlkZGxlQ29udGFpbmVyKTtcblxuICAvLyBTY2FsZSBib3R0b21Db250YWluZXIgYW5kIGJvdHRvbSBzdWIgdGl0bGUgdG8gbm90aGluZyBhbmQgYmFja1xuICAvLyBQb2x5bWVyLkJhc2UudHJhbnNmb3JtKCdzY2FsZSgnICsgc2NhbGVCb3R0b20gKyAnKSB0cmFuc2xhdGVaKDApJywgYm90dG9tQ29udGFpbmVyKTtcblxuICAvLyBTY2FsZSBtaWRkbGVDb250YWluZXIgYXBwTmFtZVxuICAvLyBQb2x5bWVyLkJhc2UudHJhbnNmb3JtKCdzY2FsZSgnICsgc2NhbGVNaWRkbGUgKyAnKSB0cmFuc2xhdGVaKDApJywgYXBwTmFtZSk7XG4gIC8vIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuZGF0YSkge1xuICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuXG4gICAgICBpZiAoZGF0YS5jb25maWcpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdjb25maWcgcmVjZWl2ZWQ6ICcsIGRhdGEuY29uZmlnKTtcbiAgICAgICAgYXBwLm5vcm1hbGl6ZUxpbWl0VG9UeXBlKGRhdGEuY29uZmlnKTtcbiAgICAgICAgYXBwLnNhdmVDb25maWcoZGF0YS5jb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2lyb24tc2lnbmFsJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoXy5pc0VxdWFsKCdjb25maWctdXBkYXRlZCcsIGV2ZW50LmRldGFpbC5uYW1lKSkge1xuXG4gICAgICBhcHAuYm9vdHN0cmFwLmZldGNoVGl0bGVzKCk7XG4gICAgfVxuICB9KTtcblxuICBhcHAuYm9vdHN0cmFwID0ge1xuXG4gICAgYmFzZVNlYXJjaFRlbXBsYXRlOiAne3NlYXJjaEJhc2V9L3N1cHBvcnQve2FwaUx9L3t0a30ve2FwcElkfS9zZWFyY2gnLFxuICAgIGJhc2VMb29rdXBUZW1wbGF0ZTogJ3tzZWFyY2hCYXNlfS9zdXBwb3J0L3thcGlMfS97dGt9L3thcHBJZH0vbG9va3VwJyxcbiAgICBiYXNlQ29udGVudFRlbXBsYXRlOiAne2NvbnRlbnRCYXNlfS9jb250ZW50LWFwaS9jb250ZW50LzEve3RrfS97YXBwSWR9JyxcbiAgICBiYXNlSXJzTWV0YVRlbXBsYXRlOiAne2lyc0Jhc2V9LzEvbWV0YScsXG4gICAgLy9odHRwOi8vbG9jYWxob3N0OjgwODAvYXNoZXMtd2ViL2NvbnRlbnQtYXBpL2NvbnRlbnQvMS9zYnAvOC90aXRsZVxuICAgIHVybFRpdGxlOiAnL3RpdGxlJyxcbiAgICB1cmxFZGl0aW9uczogJy90aXRsZS97dGl0bGVJZH0vZWRpdGlvbnMnLFxuICAgIHBhdGh1cmxTZWN0aW9uczogJy90aXRsZS97dGl0bGVJZH0vZWRpdGlvbnMve2VkaXRpb25JZH0vc2VjdGlvbnMnLFxuICAgIG1lZGlhOiAnL21lZGlhJyxcblxuICAgIHdpdGhQYXRoOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gYXBwLmJvb3RzdHJhcC5iYXNlQ29udGVudFRlbXBsYXRlICsgcGF0aDtcbiAgICB9LFxuXG4gICAgZmV0Y2hUaXRsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRlbXBsYXRlVXJsID0gYXBwLmJvb3RzdHJhcC53aXRoUGF0aChhcHAuYm9vdHN0cmFwLnVybFRpdGxlKTtcblxuICAgICAgaHR0cENsaWVudC5nZXQoYXBwLnVybEZyb21Db25maWcoYXBwLmNvbmZpZywgdGVtcGxhdGVVcmwpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBmb3JMYWJlbCA9IGZ1bmN0aW9uKHRpdGxlKSB7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHtsYWJlbDogdGl0bGUudGl0bGV9LCB0aXRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYXBwLmRiLnRpdGxlcyA9IF8ubWFwKHJlc3BvbnNlLmRhdGEsIGZvckxhYmVsKTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGFwcC5zaG93VG9hc3QoJ0NvdWxkIG5vdCBmZXRjaCB0aXRsZXMuIFNlZSBjb25zb2xlIGZvciBpbmZvLiAoe2Vycm9yfSknLCB7XG4gICAgICAgICAgZXJyb3I6IGVycm9yXG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGZldGNoRWRpdGlvbnM6IGZ1bmN0aW9uKHRpdGxlKSB7XG5cbiAgICAgIHZhciBpZHNIYXZpbmdUaXRsZU5hbWUgPSBmdW5jdGlvbih0aXRsZXMsIHRpdGxlKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChfLmZpbHRlcih0aXRsZXMsIHtsYWJlbDogdGl0bGUubGFiZWx9KSwgJ2lkJyk7XG4gICAgICB9O1xuXG4gICAgICBfLmVhY2goaWRzSGF2aW5nVGl0bGVOYW1lKGFwcC5kYi50aXRsZXMsIHRpdGxlKSwgZnVuY3Rpb24odGl0bGVJZCkge1xuICAgICAgICBpZiAoXy5pc1VuZGVmaW5lZChhcHAuZGIudGl0bGVFZGl0aW9uc1t0aXRsZUlkXSkpIHtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ1VwZGF0aW5nIHNlY3Rpb25zIGZvciB0aXRsZSB3aXRoIGlkOiAnLCB0aXRsZUlkKTtcbiAgICAgICAgICB2YXIgdGVtcGxhdGVVcmwgPSBhcHAuYm9vdHN0cmFwLndpdGhQYXRoKGFwcC5ib290c3RyYXAudXJsRWRpdGlvbnMpO1xuICAgICAgICAgIHZhciBjb25maWcgPSBhcHAuZXh0ZW5kQ29uZmlnKHt0aXRsZUlkOiB0aXRsZUlkfSk7XG5cbiAgICAgICAgICBodHRwQ2xpZW50LmdldChhcHAudXJsRnJvbUNvbmZpZyhjb25maWcsIHRlbXBsYXRlVXJsKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCd0aXRsZUVkaXRpb24gKCVzKSByZXN1bHQ6ICcsXG4gICAgICAgICAgICAgIHRpdGxlLmxhYmVsLCBfLm1hcChyZXNwb25zZS5kYXRhLCBmdW5jdGlvbihlZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUoJ2lkOiB7aWR9LCBuYW1lOiB7bmFtZX0nKShlZGl0aW9uKTtcbiAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBhcHAuZGIudGl0bGVFZGl0aW9uc1t0aXRsZS5pZF0gPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICBfLmVhY2gocmVzcG9uc2UuZGF0YSwgZnVuY3Rpb24oZWRpdGlvbikge1xuICAgICAgICAgICAgICBhcHAuYm9vdHN0cmFwLmZldGNoU2VjdGlvbnModGl0bGUsIGVkaXRpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgYXBwLnNob3dUb2FzdCgnQ291bGQgbm90IHVwZGF0ZSBlZGl0aW9ucy4ge30nLCBlcnJvciwgdHJ1ZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBmZXRjaFNlY3Rpb25zOiBmdW5jdGlvbih0aXRsZSwgZWRpdGlvbikge1xuICAgICAgdmFyIHRlbXBsYXRlU2VjdGlvbiA9IGFwcC5ib290c3RyYXAud2l0aFBhdGgoYXBwLmJvb3RzdHJhcC5wYXRodXJsU2VjdGlvbnMpO1xuICAgICAgdmFyIGNvbmZpZyA9IGFwcC5leHRlbmRDb25maWcoe3RpdGxlSWQ6IHRpdGxlLmlkLCBlZGl0aW9uSWQ6IGVkaXRpb24uaWR9KTtcblxuICAgICAgaHR0cENsaWVudC5nZXQoYXBwLnVybEZyb21Db25maWcoY29uZmlnLCB0ZW1wbGF0ZVNlY3Rpb24pKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnb3Qgc2VjdGlvbnMgZm9yIHRpdGxlKCVzKSwgZWRpdGlvbiglcyk6ICcsXG4gICAgICAgICAgdGl0bGUuaWQsIGVkaXRpb24uaWQsIHJlc3BvbnNlLmRhdGEpO1xuXG4gICAgICAgIHZhciB1cGRhdGVTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbikge1xuICAgICAgICAgIGlmICghXy5pbmNsdWRlcyhhcHAuZGIuc2VjdGlvbnMsIHNlY3Rpb24pKSB7XG4gICAgICAgICAgICBhcHAuZGIuc2VjdGlvbnMucHVzaChzZWN0aW9uKTtcblxuICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkoc2VjdGlvbi5zZWN0aW9ucykpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlY3Vyc2luZyBmb3IgJXMgd2l0aCBzZWN0aW9uczogJyxcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmxhYmVsLCBfLm1hcChzZWN0aW9uLnNlY3Rpb25zLCAnbGFiZWwnKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBfLmVhY2goc2VjdGlvbi5zZWN0aW9ucywgdXBkYXRlU2VjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIF8uZWFjaChyZXNwb25zZS5kYXRhLCB1cGRhdGVTZWN0aW9uKTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZhaWxlZCB0byB1cGRhdGUgc2VjdGlvbnMgZm9yIHRpdGxlKCVzKSBlZGl0aW9uKCVzKTogJyxcbiAgICAgICAgICB0aXRsZS5pZCwgZWRpdGlvbi5pZCwgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGFwcC5leHRlbmRDb25maWcgPSBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICByZXR1cm4gXy5leHRlbmQoZXh0ZW5zaW9uLCBhcHAuY29uZmlnKTtcbiAgfTtcblxuICBhcHAudXJsRnJvbUNvbmZpZyA9IGZ1bmN0aW9uKGNvbmZpZywgdGVtcGxhdGUpIHtcbiAgICBpZiAoXy5oYXMoY29uZmlnLCAnc2VhcmNoQmFzZScpKSB7XG4gICAgICByZXR1cm4gXy50ZW1wbGF0ZSh0ZW1wbGF0ZSkoY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdDYW5cXCd0IHN0YW1wIHRlbXBsYXRlIFxcJyVzXFwnIGZvciBjb25maWcuJywgdGVtcGxhdGUpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgLy8gU2Nyb2xsIHBhZ2UgdG8gdG9wIGFuZCBleHBhbmQgaGVhZGVyXG4gIGFwcC5zY3JvbGxQYWdlVG9Ub3AgPSBmdW5jdGlvbigpIHtcbiAgICBhcHAuJC5oZWFkZXJQYW5lbE1haW4uc2Nyb2xsVG9Ub3AodHJ1ZSk7XG4gIH07XG5cbiAgLyogICBhcHAuY2xvc2VEcmF3ZXIgPSBmdW5jdGlvbigpIHtcbiAgICBhcHAuJC5wYXBlckRyYXdlclBhbmVsLmNsb3NlRHJhd2VyKCk7XG4gIH07ICovXG5cbiAgYXBwLmdvSG9tZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChhcHAuY29uZmlnLnN0YW5kYWxvbmUpIHtcbiAgICAgIHBhZ2UucmVkaXJlY3QoYXBwLmJhc2VVcmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlLnJlZGlyZWN0KCcvc2VhcmNoJyk7XG4gICAgfVxuICB9O1xuXG4gIGFwcC5zZW5kVG9Jbml0aWF0b3IgPSBmdW5jdGlvbihyZXF1ZXN0TmFtZSwgZGF0YUtleSwgZGF0YSkge1xuXG4gICAgaWYgKF8uaXNVbmRlZmluZWQoZGF0YSkgfHwgXy5pc0VtcHR5KGRhdGEpKSB7XG4gICAgICBhcHAuc2hvd1RvYXN0KCdQbGVhc2UgZW5zdXJlIHRoYXQgYSBzZWxlY3Rpb24gZXhpc3QgYmVmb3JlIGluc2VydGluZy4nKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG5cbiAgICAgIHZhciByZXNwb25zZSA9IHt9O1xuXG4gICAgICByZXNwb25zZS5yZXF1ZXN0ID0gcmVxdWVzdE5hbWU7XG4gICAgICByZXNwb25zZVtkYXRhS2V5XSA9IGRhdGE7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpO1xuICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdzZW5kaW5nIHNlbGVjdGVkOiAlcycsIG1lc3NhZ2UpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHdpbmRvdy5vcGVuZXIucG9zdE1lc3NhZ2UobWVzc2FnZSwgJyonKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhbiBub3QgcmV0dXJuIG1lc3NhZ2UuJywgZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcC5zaG93VG9hc3QoJ05vIHZhbHVlIHRvIHNlbmQuJywge30sIHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhcHAuc2hvd1RvYXN0KCdDYW4gbm90IHNlbmQgbWVzc2FnZS4gV2luZG93IGhhcyBubyBvcGVuZXIuJywge30sIHRydWUpO1xuICAgIH1cbiAgfTtcblxuICBhcHAuZ29Ub0luZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcGFnZS5yZWRpcmVjdChhcHAuYmFzZVVybCk7XG4gIH07XG5cbiAgYXBwLmdvVG9Mb29rdXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdwYXBlci1pbnB1dCNsb29rdXBLZXknKTtcbiAgICB2YXIgY29udGVudEtleSA9IF8udHJpbShpbnB1dC52YWx1ZSk7XG5cbiAgICBpZiAoXy5pc0VtcHR5KGNvbnRlbnRLZXkpKSB7XG4gICAgICBhcHAuc2hvd1RvYXN0KCdObyBjb250ZW50IGtleSBwcm92aWRlZC4nLCB7fSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICBhcHAuJC5sb29rdXBEaWFsb2cuY2xvc2UoKTtcbiAgICAgIHBhZ2UucmVkaXJlY3QoJy9hcnRpY2xlLycgKyBjb250ZW50S2V5KTtcbiAgICB9XG4gIH07XG5cbiAgYXBwLnNob3dUb2FzdCA9IGZ1bmN0aW9uKHRleHRPclRlbXBsYXRlLCB2YWx1ZXMsIGVycm9yT3JXYXJuKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSB2YWx1ZXMgPyBfLnRlbXBsYXRlKHRleHRPclRlbXBsYXRlKSh2YWx1ZXMpIDogdGV4dE9yVGVtcGxhdGU7XG4gICAgaWYgKGVycm9yT3JXYXJuKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvci93YXJuIHRvYXN0OicpO1xuICAgICAgY29uc29sZS50cmFjZShtZXNzYWdlKTtcbiAgICB9XG4gICAgYXBwLl9zaG93VG9hc3QoYXBwLiQudG9hc3QsIG1lc3NhZ2UpO1xuICB9O1xuXG4gIGFwcC5zaG93UGVybWFUb2FzdCA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICBhcHAuX3Nob3dUb2FzdChhcHAuJC5wZXJtYVRvYXN0LCBtZXNzYWdlKTtcbiAgfTtcblxuICBhcHAuX3Nob3dUb2FzdCA9IGZ1bmN0aW9uKG5vZGUsIG1lc3NhZ2UpIHtcbiAgICBub2RlLnRleHQgPSBtZXNzYWdlO1xuICAgIG5vZGUuc2hvdygpO1xuICB9O1xuXG4gIGFwcC5tdWx0aVZhbHVlVXJsID0gZnVuY3Rpb24odGVtcGxhdGUsIGNvbmZpZ01hcCkge1xuICAgIGxldCBtYXBGb3JRdWVyeVN0cmluZyA9IF8uZXh0ZW5kKHt9LCBjb25maWdNYXApO1xuICAgIGxldCBiYXNlID0gXy50ZW1wbGF0ZSh0ZW1wbGF0ZSkoYXBwLmV4dGVuZENvbmZpZyhjb25maWdNYXApKTtcblxuICAgIGNvbnN0IGpvaW5lciA9IGogPT4gKGssdikgPT4gayArIGogKyB2O1xuXG4gICAgY29uc3QgcXVlcnlLdkpvaW4gPSBrZXkgPT4gdmFsID0+IFtrZXksIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpXS5yZWR1Y2Uoam9pbmVyKCc9JykpO1xuXG4gICAgY29uc3QgdG9LViA9IChwYXJhbSkgPT4ge1xuICAgICAgbGV0IGsgPSBwYXJhbVswXTtcbiAgICAgIGxldCB2ID0gXy5pc0FycmF5KHBhcmFtWzFdKSA/IHBhcmFtWzFdIDogW3BhcmFtWzFdXTtcbiAgICAgIHJldHVybiBfLm1hcCh2LCBxdWVyeUt2Sm9pbihrKSlcbiAgICAgICAgLnJlZHVjZShqb2luZXIoJyYnKSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGJ1aWxkUXVlcnlTdHJpbmcgPSAobWFwKSA9PiBfLm1hcChfLnRvUGFpcnMobWFwKSwgdG9LVikucmVkdWNlKGpvaW5lcignJicpKTtcblxuICAgIHJldHVybiBbYmFzZSwgYnVpbGRRdWVyeVN0cmluZyhtYXBGb3JRdWVyeVN0cmluZyldLnJlZHVjZShqb2luZXIoJz8nKSk7XG4gIH07XG5cbiAgYXBwLmxvb2t1cCA9IGZ1bmN0aW9uKGNvbnRlbnRLZXksIG9uU3VjY2Vzcywgb25FcnIpIHtcbiAgICB2YXIgdXJsID0gYXBwLm11bHRpVmFsdWVVcmwoYXBwLmJvb3RzdHJhcC5iYXNlTG9va3VwVGVtcGxhdGUsIHtcbiAgICAgIGNvbnRlbnRLZXk6IGNvbnRlbnRLZXksXG4gICAgICBkYXRhc2V0S2V5OiAnZm9yc2VhcmNoJyxcbiAgICAgIHR5cGU6ICdjb250ZW50J1xuICAgIH0pO1xuXG4gICAgYXhpb3MucG9zdCh1cmwsIHt9KS50aGVuKG9uU3VjY2VzcykuY2F0Y2gob25FcnIpO1xuICB9O1xuXG59KShkb2N1bWVudCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
