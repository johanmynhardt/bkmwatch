/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  /* Create instance of axios so we don't need to set config everywhere. */
  var httpClient;
  HTMLImports.whenReady(function() {
    httpClient  = axios.create({
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
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

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

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  app.normalizeLimitToType = function(config) {
    if (_.has(config, 'limitToType')) {
      let types = _.split(config.limitToType, ',').map((x) => {
        return _.startsWith(x, 'type-') ? x : 'type-' + x;
      });

      config.limitToType = _.join(types, ',');
    }
  };

  app.parseParams = (queryString) => {
    return _.chain(queryString.split('&'))
      .map((param) => {
        const p = param.split('=', 2);
        return [p[0], decodeURIComponent(p[1])];
      }).value();
  };

  /**
   *  Parse configuration from URL parameters. It will only signal the config when all
   *  the expected keys are present.
   */
  app.parseConfigFromQueryString = function(queryString) {
    console.info('parse config from queryString: ', queryString);
    if (queryString.length > 0) {
      let validKeys = ['appId', 'irsBase', 'searchBase', 'tk'];
      let optionalKeys = [
        'launch',
        'limitToType',
        'contentBase',
        'contextLabel',
        'multiSelect',
        'context'
      ];
      var params = {};

      let hasSupportedKey = (supportedKeys, keyToVerify) => {
        return _.find(supportedKeys, (key) => _.isEqual(key, keyToVerify));
      };

      let parsedParams = _.chain(queryString.split('&'))
        .map((param) => {
          const p = param.split('=', 2);
          return [p[0], decodeURIComponent(p[1])];
        }).value();

      parsedParams.forEach((param) => {
        let pKey = _.head(param);
        let pVal = param[1];
        if (hasSupportedKey(validKeys, pKey) || hasSupportedKey(optionalKeys, pKey)) {
          params[pKey] = pVal;
        }
      });

      if (_.keys(params).length < validKeys.length) {
        console.error('Can not create config object. Missing keys: expected %o, got %o',
                      validKeys, _.keys(params));
        return {
          error: 'Missing expected keys: ' + validKeys + ' but got ' + _.keys(params)
        };
      } else {
        params.apiL = 9;
        params.standalone = true;
        console.info('config from url params: ', params);

        /* This is a hack to make it work on Safari... NFI why this is not working otherwise.*/
        // setTimeout(function() {
        //   app.fire('iron-signal', {name: 'config-from-url', data: params});
        // }, 100);
        return params;
      }
    }
  };

  app.saveConfig = function(seedConfig) {

    const setOptionalKey = (map, key, value) => {
      if (_.isUndefined(value) || _.isNull(value)) {
        console.warn('not setting key \'%s\' on map as value is undefined/null.', key);
      } else {
        if (_.isBoolean(value) || _.includes(['true', 'false'], value)) {
          map[key] = (value === true || value === 'true');
        } else {
          map[key] = value;
        }
      }
    };

    const prependWith = prefix => value => _.startsWith(value, prefix) ? value : prefix + value;

    const parseLimitToType = (limitToType) => {
      if (_.isUndefined(limitToType) || _.isNull(limitToType)) {
        return undefined;
      } else {
        return _.chain(limitToType)
          .split(',')
          .map(prependWith('type-'))
          .join(',')
          .value();
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
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');

    // ask for configuration.
    if (window.opener) {
      var message = JSON.stringify({request: 'config'});
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
  window.addEventListener('WebComponentsReady', function() {
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

  window.addEventListener('message', function(event) {
    if (event.data) {
      var data = JSON.parse(event.data);

      if (data.config) {
        console.info('config received: ', data.config);
        app.normalizeLimitToType(data.config);
        app.saveConfig(data.config);
      }
    }
  });

  window.addEventListener('iron-signal', function(event) {
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

    withPath: function(path) {
      return app.bootstrap.baseContentTemplate + path;
    },

    fetchTitles: function() {
      var templateUrl = app.bootstrap.withPath(app.bootstrap.urlTitle);

      httpClient.get(app.urlFromConfig(app.config, templateUrl)).then(function(response) {
        var forLabel = function(title) {
          return _.extend({label: title.title}, title);
        };

        app.db.titles = _.map(response.data, forLabel);
      }).catch(function(error) {
        app.showToast('Could not fetch titles. See console for info. ({error})', {
          error: error
        }, true);
      });
    },

    fetchEditions: function(title) {

      var idsHavingTitleName = function(titles, title) {
        return _.map(_.filter(titles, {label: title.label}), 'id');
      };

      _.each(idsHavingTitleName(app.db.titles, title), function(titleId) {
        if (_.isUndefined(app.db.titleEditions[titleId])) {
          console.info('Updating sections for title with id: ', titleId);
          var templateUrl = app.bootstrap.withPath(app.bootstrap.urlEditions);
          var config = app.extendConfig({titleId: titleId});

          httpClient.get(app.urlFromConfig(config, templateUrl)).then(function(response) {
            console.info('titleEdition (%s) result: ',
              title.label, _.map(response.data, function(edition) {
                return _.template('id: {id}, name: {name}')(edition);
              }));

            app.db.titleEditions[title.id] = response.data;

            _.each(response.data, function(edition) {
              app.bootstrap.fetchSections(title, edition);
            });

          }).catch(function(error) {
            app.showToast('Could not update editions. {}', error, true);
          });
        }
      });
    },

    fetchSections: function(title, edition) {
      var templateSection = app.bootstrap.withPath(app.bootstrap.pathurlSections);
      var config = app.extendConfig({titleId: title.id, editionId: edition.id});

      httpClient.get(app.urlFromConfig(config, templateSection)).then(function(response) {
        console.log('got sections for title(%s), edition(%s): ',
          title.id, edition.id, response.data);

        var updateSection = function(section) {
          if (!_.includes(app.db.sections, section)) {
            app.db.sections.push(section);

            if (!_.isEmpty(section.sections)) {
              console.log('recursing for %s with sections: ',
                section.label, _.map(section.sections, 'label')
              );
              _.each(section.sections, updateSection);
            }
          }
        };

        _.each(response.data, updateSection);
      }).catch(function(error) {
        console.error('failed to update sections for title(%s) edition(%s): ',
          title.id, edition.id, error);
      });
    }
  };

  app.extendConfig = function(extension) {
    return _.extend(extension, app.config);
  };

  app.urlFromConfig = function(config, template) {
    if (_.has(config, 'searchBase')) {
      return _.template(template)(config);
    } else {
      console.warn('Can\'t stamp template \'%s\' for config.', template);
      return undefined;
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  /*   app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  }; */

  app.goHome = function() {
    if (app.config.standalone) {
      page.redirect(app.baseUrl);
    } else {
      page.redirect('/search');
    }
  };

  app.sendToInitiator = function(requestName, dataKey, data) {

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

  app.goToIndex = function() {
    page.redirect(app.baseUrl);
  };

  app.goToLookup = function() {
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

  app.showToast = function(textOrTemplate, values, errorOrWarn) {
    var message = values ? _.template(textOrTemplate)(values) : textOrTemplate;
    if (errorOrWarn) {
      console.error('Error/warn toast:');
      console.trace(message);
    }
    app._showToast(app.$.toast, message);
  };

  app.showPermaToast = function(message) {
    app._showToast(app.$.permaToast, message);
  };

  app._showToast = function(node, message) {
    node.text = message;
    node.show();
  };

  app.multiValueUrl = function(template, configMap) {
    let mapForQueryString = _.extend({}, configMap);
    let base = _.template(template)(app.extendConfig(configMap));

    const joiner = j => (k,v) => k + j + v;

    const queryKvJoin = key => val => [key, encodeURIComponent(val)].reduce(joiner('='));

    const toKV = (param) => {
      let k = param[0];
      let v = _.isArray(param[1]) ? param[1] : [param[1]];
      return _.map(v, queryKvJoin(k))
        .reduce(joiner('&'));
    };

    const buildQueryString = (map) => _.map(_.toPairs(map), toKV).reduce(joiner('&'));

    return [base, buildQueryString(mapForQueryString)].reduce(joiner('?'));
  };

  app.lookup = function(contentKey, onSuccess, onErr) {
    var url = app.multiValueUrl(app.bootstrap.baseLookupTemplate, {
      contentKey: contentKey,
      datasetKey: 'forsearch',
      type: 'content'
    });

    axios.post(url, {}).then(onSuccess).catch(onErr);
  };

})(document);
