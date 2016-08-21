'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-search',
    properties: {
      loading: {
        type: Boolean,
        value: false,
        observer: 'loadingChanged'
      },
      searchDuration: {
        type: Number,
        value: 0,
        notify: true
      },
      searchModel: {
        type: String,
        value: '',
        readOnly: false,
        notify: true
      },
      searchInProgress: {
        type: Boolean,
        value: false,
        notify: true
      },
      searchType: {
        type: String,
        value: 'type-media',
        notify: true,
        observer: '_searchTypeChanged'
      },
      canSubmit: {
        type: Boolean,
        value: true,
        notify: true,
        observer: 'canSubmitChanged'
      },
      pageData: {
        type: Object,
        value: {},
        observer: 'pageDataResponse',
        notify: true
      },
      results: {
        type: Array,
        value: undefined,
        notify: true
      },
      firstSearchReturned: {
        type: Boolean,
        value: false,
        notify: true
      },
      forQuery: {
        type: String,
        value: undefined,
        notify: true
      },
      page: {
        type: Number,
        value: 0,
        notify: true
      },
      pages: {
        type: Number,
        value: 0,
        notify: true
      },
      pageSize: {
        type: Number,
        value: 10,
        notify: true
      },
      totalElements: {
        type: Number,
        value: 0,
        notify: true
      },
      hasNext: {
        type: Boolean,
        value: false,
        notify: true
      },
      hasPrevious: {
        type: Boolean,
        value: false,
        notify: true
      },
      lastSearch: {
        type: String,
        value: undefined
      },
      minSubmit: {
        type: Number,
        value: 3
      },
      target: {
        type: Object,
        value: function value() {
          var target = this.$.submit;
          console.log('target: ', target);
          return target;
        },
        notify: true
      },

      _filterDisplay: {
        type: Boolean,
        value: false,
        observer: '_filterDisplayChanged'
      },

      _filterDropdownIcon: {
        type: String,
        value: 'arrow-drop-down'
      }
    },
    observers: ['queryChanged(searchModel)'],

    /**
     * Only activate canSubmit after a delay, otherwise the search is submitted prematurely.
     */
    canSubmitChanged: function canSubmitChanged(newValue, oldValue) {
      if (_.isUndefined(oldValue)) {
        var activateSubmit = function activateSubmit(host) {
          return function () {
            host.canSubmit = true;
          };
        };
        setTimeout(activateSubmit(this), 500);
      }
    },

    handleResponse: function handleResponse(response) {

      var extractDuration = function extractDuration(resp) {
        var durHeader = 'X-Afzr-Duration-Search';
        var duration = resp.detail.xhr.getResponseHeader(durHeader);
        var durInt = void 0;

        if (_.isEmpty(duration)) {
          durInt = 0;
          console.error('Could not extract header \'%s\' from response.' + ' (Backend possibly doesn\'t support correct CORS headers).' + ' Duration was set to 0.', durHeader);
        } else {
          durInt = parseInt(duration);
        }
        return durInt;
      };

      this.searchDuration = extractDuration(response);
    },

    doSearch: function doSearch(optReset) {
      if (this.canSubmit) {
        if (!_.isEqual(this.searchModel, this.lastSearch) || optReset) {
          this.results = [];
        }

        var resetForSearch = function resetForSearch(fieldsFor) {
          fieldsFor.page = 0;
          fieldsFor.pages = 0;
          fieldsFor.hasNext = false;
          app.showToast('Searching for: \'{text}\'', { text: fieldsFor.searchModel });
          fieldsFor.searchInProgress = true;
          fieldsFor.lastSearch = fieldsFor.searchModel;
          return fieldsFor;
        };

        resetForSearch(this)._generateRequest();
      } else {
        console.warn('searchModel is undefined/empty. Not submitting search.');
      }
    },

    queryChanged: function queryChanged(newQuery) {
      this.canSubmit = newQuery.length >= this.minSubmit;
    },

    pageDataResponse: function pageDataResponse() {
      var pushResult = function pushResult(to) {
        return function (newItem) {
          return to.push('results', newItem);
        };
      };

      var isTypeAndHasPath = _.curry(function (host, test, path) {
        if (_.isString(test)) {
          test = [test];
        }
        var result = _.includes(test, host.searchType) && _.hasIn(host, path);
        console.trace('isTypeAndHasPath: ', test, path, host.searchType, result);
        return result;
      });

      var typeMap = {
        'type-media': 'pageData.media',
        'type-image': 'pageData.media',
        'type-video': 'pageData.media',
        'type-article': 'pageData.content'
      };

      var mediaTypes = ['type-media', 'type-image', 'type-video'];
      var articleTypes = ['type-article'];

      var foundType = void 0;
      if (isTypeAndHasPath(this, mediaTypes, typeMap[mediaTypes[0]])) {
        foundType = this.pageData.media;
      } else if (isTypeAndHasPath(this, articleTypes, typeMap[articleTypes[0]])) {
        foundType = this.pageData.content;
      } else {
        console.error('No element \'%s\' for search type: \'%s\' found.', typeMap[this.searchType], this.searchType);
      }

      if (foundType) {
        if (app.config.context === 'related') {
          _.chain(foundType).filter(function (item) {
            return _.has(item, 'metaData.publicReference');
          }).filter(function (item) {
            return !_.isEmpty(item.metaData.publicReference);
          }).value().forEach(pushResult(this));
        } else {
          foundType.forEach(pushResult(this));
        }
      } else {
        this.results = [];
      }

      if (this.firstSearchReturned === false) {
        this.firstSearchReturned = true;
      }

      this.forQuery = this.searchModel;

      if (this.pageData.pageData) {
        var pageData = this.pageData.pageData;
        console.log('pageData: ', pageData);
        this.pages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.set('pages', this.pages);

        this.hasNext = pageData.pageNumber < pageData.totalPages - 1;
        this.hasPrevious = pageData.pageNumber > 0;
        this.searchInProgress = false;
      }
    },

    displayPage: function displayPage(page) {
      return page + 1;
    },

    fetchNext: function fetchNext() {
      console.log('fetchNext...');
      this.page = this.page + 1;
      this.searchInProgress = true;
      this._generateRequest();
    },

    fetchPrevious: function fetchPrevious() {
      this.page = this.page - 1;
      this._generateRequest();
    },

    manyPages: function manyPages(pages) {
      return pages > 1;
    },

    toggleFilter: function toggleFilter() {
      this.set('_filterDisplay', !this.$.mySearchFilter.displayFilter);
    },

    _filterDisplayChanged: function _filterDisplayChanged(newValue) {
      var upDown = function upDown(display) {
        return 'arrow-drop-' + (display ? 'up' : 'down');
      };
      this.set('_filterDropdownIcon', upDown(newValue));
    },

    _getTime: function _getTime(date, orElse) {
      return date ? date.getTime() : orElse;
    },

    loadingChanged: function loadingChanged(newValue) {
      console.info('loadingChanged: ', newValue);
      this.fire('iron-signal', {
        name: 'search-loading-changed',
        data: {
          loading: newValue,
          hasNext: this.hasNext
        }
      });
    },

    nextPage: function nextPage() {
      this.fetchNext();
    },

    displayToast: function displayToast(message) {
      console.info('toast: %s', message);
      app.showToast(message);
    },

    _generateRequest: function _generateRequest() {
      this._updateRequestUrl();

      this.$.ajaxSearch.generateRequest();
    },

    _searchTypeChanged: function _searchTypeChanged(newSearchType) {
      console.log('newSearchType: ', newSearchType);
      this.doSearch(true);
    },

    _updateRequestUrl: function _updateRequestUrl() {
      console.log('Updating request URL... app.config: ', app.config);

      /*var wildcardPaddingWithLowercase = function(input) {
        if (_.isEmpty(input)) {
          return '*';
        } else {
          return _.template('*{value}*')({
            value: encodeURIComponent(_.toLower(input))
          });
        }
      };*/

      var typeMap = {
        // the value will be used in search query for type parameter.
        // currently only content and media is supported.
        // new types in development (elasticsearch): image, video, audio.
        'type-article': 'content',
        'type-audio': 'audio',
        'type-image': 'image',
        'type-video': 'video',
        'type-media': 'media', // deprecated

        forType: function forType(input) {
          return typeMap[input];
        }
      };

      /*var collectionFilter = function(collection) {
        var firstItemOrValue = _.isArray(collection) ? _.first(collection) : collection;
        return wildcardPaddingWithLowercase(_.has(firstItemOrValue, 'label') ?
            firstItemOrValue.label :
            firstItemOrValue);
      };*/

      var collectionFilterMulti = function collectionFilterMulti(collection) {
        var result = _.compact(_.map(collection, function (item) {
          return _.has(item, 'label') ? item.label : undefined;
        }));

        return _.isEmpty(result) ? '' : result;
      };

      var optParams = function optParams(parameters, optSource) {
        _.each(optSource, function (value, key) {
          if (!_.isEmpty(value)) {
            parameters[key] = value;
          }
        });
      };

      var queryParameters = {
        datasetKey: 'forsearch',
        type: typeMap.forType(this.searchType),
        // include publicReference if context is 'related'.
        meta: app.config.context === 'related' ? _.join(['all', 'publicReference'], ',') : 'all',
        pageNumber: this.page,
        pageSize: this.pageSize,
        searchMode: 'archive'
      };

      optParams(queryParameters, {
        term: this.searchModel,
        titleName: collectionFilterMulti(this.$.mySearchFilter.titles),
        'sections.sectionName': collectionFilterMulti(this.$.mySearchFilter.sections),
        startDate: this._getTime(this.startDate, ''),
        endDate: this._getTime(this.endDate, '')
      });

      this.requestUrl = app.multiValueUrl(app.bootstrap.baseSearchTemplate, queryParameters);

      console.info('SEARCH_REQUEST_URL: %s', this.requestUrl);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1zZWFyY2gvYWNhLXNlYXJjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNOOztBQUNBLFVBQVE7QUFDTixRQUFJLFlBREU7QUFFTixnQkFBWTtBQUNWLGVBQVM7QUFDUCxjQUFNLE9BREM7QUFFUCxlQUFPLEtBRkE7QUFHUCxrQkFBVTtBQUhILE9BREM7QUFNVixzQkFBZ0I7QUFDZCxjQUFNLE1BRFE7QUFFZCxlQUFPLENBRk87QUFHZCxnQkFBUTtBQUhNLE9BTk47QUFXVixtQkFBYTtBQUNYLGNBQU0sTUFESztBQUVYLGVBQU8sRUFGSTtBQUdYLGtCQUFVLEtBSEM7QUFJWCxnQkFBUTtBQUpHLE9BWEg7QUFpQlYsd0JBQWtCO0FBQ2hCLGNBQU0sT0FEVTtBQUVoQixlQUFPLEtBRlM7QUFHaEIsZ0JBQVE7QUFIUSxPQWpCUjtBQXNCVixrQkFBWTtBQUNWLGNBQU0sTUFESTtBQUVWLGVBQU8sWUFGRztBQUdWLGdCQUFRLElBSEU7QUFJVixrQkFBVTtBQUpBLE9BdEJGO0FBNEJWLGlCQUFXO0FBQ1QsY0FBTSxPQURHO0FBRVQsZUFBTyxJQUZFO0FBR1QsZ0JBQVEsSUFIQztBQUlULGtCQUFVO0FBSkQsT0E1QkQ7QUFrQ1YsZ0JBQVU7QUFDUixjQUFNLE1BREU7QUFFUixlQUFPLEVBRkM7QUFHUixrQkFBVSxrQkFIRjtBQUlSLGdCQUFRO0FBSkEsT0FsQ0E7QUF3Q1YsZUFBUztBQUNQLGNBQU0sS0FEQztBQUVQLGVBQU8sU0FGQTtBQUdQLGdCQUFRO0FBSEQsT0F4Q0M7QUE2Q1YsMkJBQXFCO0FBQ25CLGNBQU0sT0FEYTtBQUVuQixlQUFPLEtBRlk7QUFHbkIsZ0JBQVE7QUFIVyxPQTdDWDtBQWtEVixnQkFBVTtBQUNSLGNBQU0sTUFERTtBQUVSLGVBQU8sU0FGQztBQUdSLGdCQUFRO0FBSEEsT0FsREE7QUF1RFYsWUFBTTtBQUNKLGNBQU0sTUFERjtBQUVKLGVBQU8sQ0FGSDtBQUdKLGdCQUFR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LENBQU8sY0FBUCxDQUFzQixRQUE1QyxDQUhDO0FBSXpCLG1CQUFXLEtBQUssUUFBTCxDQUFjLEtBQUssU0FBbkIsRUFBOEIsRUFBOUIsQ0FKYztBQUt6QixpQkFBUyxLQUFLLFFBQUwsQ0FBYyxLQUFLLE9BQW5CLEVBQTRCLEVBQTVCO0FBTGdCLE9BQTNCOztBQVFBLFdBQUssVUFBTCxHQUFrQixJQUFJLGFBQUosQ0FBa0IsSUFBSSxTQUFKLENBQWMsa0JBQWhDLEVBQW9ELGVBQXBELENBQWxCOztBQUVBLGNBQVEsSUFBUixDQUFhLHdCQUFiLEVBQXVDLEtBQUssVUFBNUM7QUFDRDtBQTNYSyxHQUFSO0FBNlhELENBL1hMIiwiZmlsZSI6ImVsZW1lbnRzL2FjYS1zZWFyY2gvYWNhLXNlYXJjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIFBvbHltZXIoe1xuICAgICAgICBpczogJ2FjYS1zZWFyY2gnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbG9hZGluZzoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG9ic2VydmVyOiAnbG9hZGluZ0NoYW5nZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZWFyY2hEdXJhdGlvbjoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlYXJjaE1vZGVsOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICByZWFkT25seTogZmFsc2UsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlYXJjaEluUHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlYXJjaFR5cGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAndHlwZS1tZWRpYScsXG4gICAgICAgICAgICBub3RpZnk6IHRydWUsXG4gICAgICAgICAgICBvYnNlcnZlcjogJ19zZWFyY2hUeXBlQ2hhbmdlZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhblN1Ym1pdDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgbm90aWZ5OiB0cnVlLFxuICAgICAgICAgICAgb2JzZXJ2ZXI6ICdjYW5TdWJtaXRDaGFuZ2VkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcGFnZURhdGE6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIG9ic2VydmVyOiAncGFnZURhdGFSZXNwb25zZScsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc3VsdHM6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlyc3RTZWFyY2hSZXR1cm5lZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZm9yUXVlcnk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhZ2U6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgbm90aWZ5OiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwYWdlczoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhZ2VTaXplOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogMTAsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvdGFsRWxlbWVudHM6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgbm90aWZ5OiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBoYXNOZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5OiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBoYXNQcmV2aW91czoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbGFzdFNlYXJjaDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWluU3VibWl0OiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLiQuc3VibWl0O1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0OiAnLCB0YXJnZXQpO1xuICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBfZmlsdGVyRGlzcGxheToge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG9ic2VydmVyOiAnX2ZpbHRlckRpc3BsYXlDaGFuZ2VkJ1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBfZmlsdGVyRHJvcGRvd25JY29uOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJ2Fycm93LWRyb3AtZG93bidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9ic2VydmVyczogW1xuICAgICAgICAgICdxdWVyeUNoYW5nZWQoc2VhcmNoTW9kZWwpJ1xuICAgICAgICBdLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbmx5IGFjdGl2YXRlIGNhblN1Ym1pdCBhZnRlciBhIGRlbGF5LCBvdGhlcndpc2UgdGhlIHNlYXJjaCBpcyBzdWJtaXR0ZWQgcHJlbWF0dXJlbHkuXG4gICAgICAgICAqL1xuICAgICAgICBjYW5TdWJtaXRDaGFuZ2VkOiBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAoXy5pc1VuZGVmaW5lZChvbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIGxldCBhY3RpdmF0ZVN1Ym1pdCA9IGZ1bmN0aW9uKGhvc3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGhvc3QuY2FuU3VibWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGFjdGl2YXRlU3VibWl0KHRoaXMpLCA1MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVSZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgICAgIGxldCBleHRyYWN0RHVyYXRpb24gPSBmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgICBjb25zdCBkdXJIZWFkZXIgPSAnWC1BZnpyLUR1cmF0aW9uLVNlYXJjaCc7XG4gICAgICAgICAgICBsZXQgZHVyYXRpb24gPSByZXNwLmRldGFpbC54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoZHVySGVhZGVyKTtcbiAgICAgICAgICAgIGxldCBkdXJJbnQ7XG5cbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoZHVyYXRpb24pKSB7XG4gICAgICAgICAgICAgIGR1ckludCA9IDA7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBleHRyYWN0IGhlYWRlciBcXCclc1xcJyBmcm9tIHJlc3BvbnNlLicgK1xuICAgICAgICAgICAgICAgICAgJyAoQmFja2VuZCBwb3NzaWJseSBkb2VzblxcJ3Qgc3VwcG9ydCBjb3JyZWN0IENPUlMgaGVhZGVycykuJyArXG4gICAgICAgICAgICAgICAgICAnIER1cmF0aW9uIHdhcyBzZXQgdG8gMC4nLCBkdXJIZWFkZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZHVySW50ID0gcGFyc2VJbnQoZHVyYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGR1ckludDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy5zZWFyY2hEdXJhdGlvbiA9IGV4dHJhY3REdXJhdGlvbihyZXNwb25zZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZG9TZWFyY2g6IGZ1bmN0aW9uKG9wdFJlc2V0KSB7XG4gICAgICAgICAgaWYgKHRoaXMuY2FuU3VibWl0KSB7XG4gICAgICAgICAgICBpZiAoIV8uaXNFcXVhbCh0aGlzLnNlYXJjaE1vZGVsLCB0aGlzLmxhc3RTZWFyY2gpIHx8IG9wdFJlc2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNldEZvclNlYXJjaCA9IChmaWVsZHNGb3IpID0+IHtcbiAgICAgICAgICAgICAgZmllbGRzRm9yLnBhZ2UgPSAwO1xuICAgICAgICAgICAgICBmaWVsZHNGb3IucGFnZXMgPSAwO1xuICAgICAgICAgICAgICBmaWVsZHNGb3IuaGFzTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgICBhcHAuc2hvd1RvYXN0KCdTZWFyY2hpbmcgZm9yOiBcXCd7dGV4dH1cXCcnLCB7dGV4dDogZmllbGRzRm9yLnNlYXJjaE1vZGVsfSk7XG4gICAgICAgICAgICAgIGZpZWxkc0Zvci5zZWFyY2hJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZmllbGRzRm9yLmxhc3RTZWFyY2ggPSBmaWVsZHNGb3Iuc2VhcmNoTW9kZWw7XG4gICAgICAgICAgICAgIHJldHVybiBmaWVsZHNGb3I7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNldEZvclNlYXJjaCh0aGlzKS5fZ2VuZXJhdGVSZXF1ZXN0KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybignc2VhcmNoTW9kZWwgaXMgdW5kZWZpbmVkL2VtcHR5LiBOb3Qgc3VibWl0dGluZyBzZWFyY2guJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHF1ZXJ5Q2hhbmdlZDogZnVuY3Rpb24obmV3UXVlcnkpIHtcbiAgICAgICAgICB0aGlzLmNhblN1Ym1pdCA9IChuZXdRdWVyeS5sZW5ndGggPj0gdGhpcy5taW5TdWJtaXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhZ2VEYXRhUmVzcG9uc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnN0IHB1c2hSZXN1bHQgPSB0byA9PiBuZXdJdGVtID0+IHRvLnB1c2goJ3Jlc3VsdHMnLCBuZXdJdGVtKTtcblxuICAgICAgICAgIGNvbnN0IGlzVHlwZUFuZEhhc1BhdGggPSBfLmN1cnJ5KGZ1bmN0aW9uKGhvc3QsIHRlc3QsIHBhdGgpIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKHRlc3QpKSB7XG4gICAgICAgICAgICAgIHRlc3QgPSBbdGVzdF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gXy5pbmNsdWRlcyh0ZXN0LCBob3N0LnNlYXJjaFR5cGUpICYmIF8uaGFzSW4oaG9zdCwgcGF0aCk7XG4gICAgICAgICAgICBjb25zb2xlLnRyYWNlKCdpc1R5cGVBbmRIYXNQYXRoOiAnLCB0ZXN0LCBwYXRoLCBob3N0LnNlYXJjaFR5cGUsIHJlc3VsdCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgdHlwZU1hcCA9IHtcbiAgICAgICAgICAgICd0eXBlLW1lZGlhJzogJ3BhZ2VEYXRhLm1lZGlhJyxcbiAgICAgICAgICAgICd0eXBlLWltYWdlJzogJ3BhZ2VEYXRhLm1lZGlhJyxcbiAgICAgICAgICAgICd0eXBlLXZpZGVvJzogJ3BhZ2VEYXRhLm1lZGlhJyxcbiAgICAgICAgICAgICd0eXBlLWFydGljbGUnOiAncGFnZURhdGEuY29udGVudCdcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgbWVkaWFUeXBlcyA9IFsndHlwZS1tZWRpYScsJ3R5cGUtaW1hZ2UnLCAndHlwZS12aWRlbyddO1xuICAgICAgICAgIGNvbnN0IGFydGljbGVUeXBlcyA9IFsndHlwZS1hcnRpY2xlJ107XG5cbiAgICAgICAgICBsZXQgZm91bmRUeXBlO1xuICAgICAgICAgIGlmIChpc1R5cGVBbmRIYXNQYXRoKHRoaXMsIG1lZGlhVHlwZXMsIHR5cGVNYXBbbWVkaWFUeXBlc1swXV0pKSB7XG4gICAgICAgICAgICBmb3VuZFR5cGUgPSB0aGlzLnBhZ2VEYXRhLm1lZGlhO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXNUeXBlQW5kSGFzUGF0aCh0aGlzLCBhcnRpY2xlVHlwZXMsIHR5cGVNYXBbYXJ0aWNsZVR5cGVzWzBdXSkpIHtcbiAgICAgICAgICAgIGZvdW5kVHlwZSA9IHRoaXMucGFnZURhdGEuY29udGVudDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTm8gZWxlbWVudCBcXCclc1xcJyBmb3Igc2VhcmNoIHR5cGU6IFxcJyVzXFwnIGZvdW5kLicsIHR5cGVNYXBbdGhpcy5zZWFyY2hUeXBlXSwgdGhpcy5zZWFyY2hUeXBlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZm91bmRUeXBlKSB7XG4gICAgICAgICAgICBpZiAoYXBwLmNvbmZpZy5jb250ZXh0ID09PSAncmVsYXRlZCcpIHtcbiAgICAgICAgICAgICAgXy5jaGFpbihmb3VuZFR5cGUpXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gXy5oYXMoaXRlbSwgJ21ldGFEYXRhLnB1YmxpY1JlZmVyZW5jZScpKVxuICAgICAgICAgICAgICAgICAgLmZpbHRlcihpdGVtID0+ICFfLmlzRW1wdHkoaXRlbS5tZXRhRGF0YS5wdWJsaWNSZWZlcmVuY2UpKVxuICAgICAgICAgICAgICAgICAgLnZhbHVlKClcbiAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKHB1c2hSZXN1bHQodGhpcykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZm91bmRUeXBlLmZvckVhY2gocHVzaFJlc3VsdCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmZpcnN0U2VhcmNoUmV0dXJuZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0U2VhcmNoUmV0dXJuZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZm9yUXVlcnkgPSB0aGlzLnNlYXJjaE1vZGVsO1xuXG4gICAgICAgICAgaWYgKHRoaXMucGFnZURhdGEucGFnZURhdGEpIHtcbiAgICAgICAgICAgIGxldCBwYWdlRGF0YSA9IHRoaXMucGFnZURhdGEucGFnZURhdGE7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGFnZURhdGE6ICcsIHBhZ2VEYXRhKTtcbiAgICAgICAgICAgIHRoaXMucGFnZXMgPSBwYWdlRGF0YS50b3RhbFBhZ2VzO1xuICAgICAgICAgICAgdGhpcy50b3RhbEVsZW1lbnRzID0gcGFnZURhdGEudG90YWxFbGVtZW50cztcbiAgICAgICAgICAgIHRoaXMuc2V0KCdwYWdlcycsIHRoaXMucGFnZXMpO1xuXG4gICAgICAgICAgICB0aGlzLmhhc05leHQgPSBwYWdlRGF0YS5wYWdlTnVtYmVyIDwgKHBhZ2VEYXRhLnRvdGFsUGFnZXMgLSAxKTtcbiAgICAgICAgICAgIHRoaXMuaGFzUHJldmlvdXMgPSBwYWdlRGF0YS5wYWdlTnVtYmVyID4gMDtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkaXNwbGF5UGFnZTogZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgIHJldHVybiBwYWdlICsgMTtcbiAgICAgICAgfSxcblxuICAgICAgICBmZXRjaE5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmZXRjaE5leHQuLi4nKTtcbiAgICAgICAgICB0aGlzLnBhZ2UgPSB0aGlzLnBhZ2UgKyAxO1xuICAgICAgICAgIHRoaXMuc2VhcmNoSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fZ2VuZXJhdGVSZXF1ZXN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmV0Y2hQcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5wYWdlIC0gMTtcbiAgICAgICAgICB0aGlzLl9nZW5lcmF0ZVJlcXVlc3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYW55UGFnZXM6IGZ1bmN0aW9uKHBhZ2VzKSB7XG4gICAgICAgICAgcmV0dXJuIHBhZ2VzID4gMTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b2dnbGVGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuc2V0KCdfZmlsdGVyRGlzcGxheScsICF0aGlzLiQubXlTZWFyY2hGaWx0ZXIuZGlzcGxheUZpbHRlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2ZpbHRlckRpc3BsYXlDaGFuZ2VkOiBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgIGxldCB1cERvd24gPSAoZGlzcGxheSkgPT4gJ2Fycm93LWRyb3AtJyArIChkaXNwbGF5ID8gJ3VwJyA6ICdkb3duJyk7XG4gICAgICAgICAgdGhpcy5zZXQoJ19maWx0ZXJEcm9wZG93bkljb24nLCB1cERvd24obmV3VmFsdWUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZ2V0VGltZTogZnVuY3Rpb24oZGF0ZSwgb3JFbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGUgPyBkYXRlLmdldFRpbWUoKSA6IG9yRWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBsb2FkaW5nQ2hhbmdlZDogZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ2xvYWRpbmdDaGFuZ2VkOiAnLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgdGhpcy5maXJlKCdpcm9uLXNpZ25hbCcsIHtcbiAgICAgICAgICAgIG5hbWU6ICdzZWFyY2gtbG9hZGluZy1jaGFuZ2VkJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbG9hZGluZzogbmV3VmFsdWUsXG4gICAgICAgICAgICAgIGhhc05leHQ6IHRoaXMuaGFzTmV4dFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLmZldGNoTmV4dCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpc3BsYXlUb2FzdDogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgIGNvbnNvbGUuaW5mbygndG9hc3Q6ICVzJywgbWVzc2FnZSk7XG4gICAgICAgICAgYXBwLnNob3dUb2FzdChtZXNzYWdlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZ2VuZXJhdGVSZXF1ZXN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLl91cGRhdGVSZXF1ZXN0VXJsKCk7XG5cbiAgICAgICAgICB0aGlzLiQuYWpheFNlYXJjaC5nZW5lcmF0ZVJlcXVlc3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfc2VhcmNoVHlwZUNoYW5nZWQ6IGZ1bmN0aW9uKG5ld1NlYXJjaFR5cGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbmV3U2VhcmNoVHlwZTogJywgbmV3U2VhcmNoVHlwZSk7XG4gICAgICAgICAgdGhpcy5kb1NlYXJjaCh0cnVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfdXBkYXRlUmVxdWVzdFVybDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1VwZGF0aW5nIHJlcXVlc3QgVVJMLi4uIGFwcC5jb25maWc6ICcsIGFwcC5jb25maWcpO1xuXG4gICAgICAgICAgLyp2YXIgd2lsZGNhcmRQYWRkaW5nV2l0aExvd2VyY2FzZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgICAgICBpZiAoXy5pc0VtcHR5KGlucHV0KSkge1xuICAgICAgICAgICAgICByZXR1cm4gJyonO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUoJyp7dmFsdWV9KicpKHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogZW5jb2RlVVJJQ29tcG9uZW50KF8udG9Mb3dlcihpbnB1dCkpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07Ki9cblxuICAgICAgICAgIGNvbnN0IHR5cGVNYXAgPSB7XG4gICAgICAgICAgICAvLyB0aGUgdmFsdWUgd2lsbCBiZSB1c2VkIGluIHNlYXJjaCBxdWVyeSBmb3IgdHlwZSBwYXJhbWV0ZXIuXG4gICAgICAgICAgICAvLyBjdXJyZW50bHkgb25seSBjb250ZW50IGFuZCBtZWRpYSBpcyBzdXBwb3J0ZWQuXG4gICAgICAgICAgICAvLyBuZXcgdHlwZXMgaW4gZGV2ZWxvcG1lbnQgKGVsYXN0aWNzZWFyY2gpOiBpbWFnZSwgdmlkZW8sIGF1ZGlvLlxuICAgICAgICAgICAgJ3R5cGUtYXJ0aWNsZSc6ICdjb250ZW50JyxcbiAgICAgICAgICAgICd0eXBlLWF1ZGlvJzogJ2F1ZGlvJyxcbiAgICAgICAgICAgICd0eXBlLWltYWdlJzogJ2ltYWdlJyxcbiAgICAgICAgICAgICd0eXBlLXZpZGVvJzogJ3ZpZGVvJyxcbiAgICAgICAgICAgICd0eXBlLW1lZGlhJzogJ21lZGlhJywgLy8gZGVwcmVjYXRlZFxuXG4gICAgICAgICAgICBmb3JUeXBlOiAoaW5wdXQpID0+IHR5cGVNYXBbaW5wdXRdXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8qdmFyIGNvbGxlY3Rpb25GaWx0ZXIgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RJdGVtT3JWYWx1ZSA9IF8uaXNBcnJheShjb2xsZWN0aW9uKSA/IF8uZmlyc3QoY29sbGVjdGlvbikgOiBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIHdpbGRjYXJkUGFkZGluZ1dpdGhMb3dlcmNhc2UoXy5oYXMoZmlyc3RJdGVtT3JWYWx1ZSwgJ2xhYmVsJykgP1xuICAgICAgICAgICAgICAgIGZpcnN0SXRlbU9yVmFsdWUubGFiZWwgOlxuICAgICAgICAgICAgICAgIGZpcnN0SXRlbU9yVmFsdWUpO1xuICAgICAgICAgIH07Ki9cblxuICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25GaWx0ZXJNdWx0aSA9IChjb2xsZWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gXy5jb21wYWN0KF8ubWFwKGNvbGxlY3Rpb24sIChpdGVtKSA9PiBfLmhhcyhpdGVtLCAnbGFiZWwnKSA/IGl0ZW0ubGFiZWwgOiB1bmRlZmluZWQpKTtcblxuICAgICAgICAgICAgcmV0dXJuIF8uaXNFbXB0eShyZXN1bHQpID8gJycgOiByZXN1bHQ7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG9wdFBhcmFtcyA9IChwYXJhbWV0ZXJzLCBvcHRTb3VyY2UpID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChvcHRTb3VyY2UsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgbGV0IHF1ZXJ5UGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIGRhdGFzZXRLZXk6ICdmb3JzZWFyY2gnLFxuICAgICAgICAgICAgdHlwZTogdHlwZU1hcC5mb3JUeXBlKHRoaXMuc2VhcmNoVHlwZSksXG4gICAgICAgICAgICAvLyBpbmNsdWRlIHB1YmxpY1JlZmVyZW5jZSBpZiBjb250ZXh0IGlzICdyZWxhdGVkJy5cbiAgICAgICAgICAgIG1ldGE6IGFwcC5jb25maWcuY29udGV4dCA9PT0gJ3JlbGF0ZWQnID9cbiAgICAgICAgICAgICAgICBfLmpvaW4oWydhbGwnLCAncHVibGljUmVmZXJlbmNlJ10sICcsJykgOlxuICAgICAgICAgICAgICAgICdhbGwnLFxuICAgICAgICAgICAgcGFnZU51bWJlcjogdGhpcy5wYWdlLFxuICAgICAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICAgICAgICBzZWFyY2hNb2RlOiAnYXJjaGl2ZSdcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgb3B0UGFyYW1zKHF1ZXJ5UGFyYW1ldGVycywge1xuICAgICAgICAgICAgdGVybTogdGhpcy5zZWFyY2hNb2RlbCxcbiAgICAgICAgICAgIHRpdGxlTmFtZTogY29sbGVjdGlvbkZpbHRlck11bHRpKHRoaXMuJC5teVNlYXJjaEZpbHRlci50aXRsZXMpLFxuICAgICAgICAgICAgJ3NlY3Rpb25zLnNlY3Rpb25OYW1lJzogY29sbGVjdGlvbkZpbHRlck11bHRpKHRoaXMuJC5teVNlYXJjaEZpbHRlci5zZWN0aW9ucyksXG4gICAgICAgICAgICBzdGFydERhdGU6IHRoaXMuX2dldFRpbWUodGhpcy5zdGFydERhdGUsICcnKSxcbiAgICAgICAgICAgIGVuZERhdGU6IHRoaXMuX2dldFRpbWUodGhpcy5lbmREYXRlLCAnJylcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMucmVxdWVzdFVybCA9IGFwcC5tdWx0aVZhbHVlVXJsKGFwcC5ib290c3RyYXAuYmFzZVNlYXJjaFRlbXBsYXRlLCBxdWVyeVBhcmFtZXRlcnMpO1xuXG4gICAgICAgICAgY29uc29sZS5pbmZvKCdTRUFSQ0hfUkVRVUVTVF9VUkw6ICVzJywgdGhpcy5yZXF1ZXN0VXJsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
