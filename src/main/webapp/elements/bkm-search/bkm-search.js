'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BkmSearch = function () {
  function BkmSearch() {
    _classCallCheck(this, BkmSearch);
  }

  _createClass(BkmSearch, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'bkm-search';

      this.properties = {
        alerts: {
          type: Array,
          value: []
        },

        page: {
          type: Number,
          value: 0
        },

        pageDisplay: {
          type: Number,
          value: 0
        },

        pages: {
          type: Number,
          value: 0
        },

        perPage: {
          type: Number,
          value: 10
        },

        items: {
          type: Array,
          value: []
        },

        q: {
          type: String,
          value: '',
          observer: 'qChanged'
        },

        currentQ: {
          type: String,
          value: ''
        },

        hasResults: {
          type: Boolean,
          value: false
        },

        _firstPage: {
          type: Boolean,
          value: true
        },

        _lastPage: {
          type: Boolean,
          value: true
        },

        _url: {
          type: String,
          value: ''
        }
      };
    }
  }, {
    key: 'handleResponse',
    value: function handleResponse(resp) {
      this.set('currentQ', this.q);
      this.set('resultCount', this.alerts.length);
      this.set('page', 0);
      this.set('pages', Math.ceil(this.alerts.length / this.perPage));
      this.set('pageDisplay', this.page + 1);

      if (resp.detail.response.length > 0) {
        this.updateItems(this.page, this.perPage);
      } else {
        this.set('items', []);
      }

      this.set('hasResults', this.items.length > 0);
    }
  }, {
    key: 'updateItems',
    value: function updateItems(page, perPage) {
      console.info('page: %s, perPage: %s', page, perPage);
      this.set('pageDisplay', this.page + 1);
      var start = page * perPage;
      var end = start + perPage;
      this.set('items', this.alerts.slice(start, end));
      this.set('_firstPage', this.page <= 0);
      this.set('_lastPage', this.alerts.length === 0 || this.items.length < this.perPage);
    }
  }, {
    key: 'doSearch',
    value: function doSearch() {
      this.set('_url', 'record/search?search=' + encodeURIComponent(this.q));
    }
  }, {
    key: 'qChanged',
    value: function qChanged(newValue, oldValue) {
      console.info('q updated: %s -> %s', oldValue, newValue);
    }
  }, {
    key: 'previousPage',
    value: function previousPage() {
      this.updateItems(this.page = this.page - 1, this.perPage);
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      this.updateItems(this.page = this.page + 1, this.perPage);
    }
  }]);

  return BkmSearch;
}();

Polymer(BkmSearch);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2JrbS1zZWFyY2gvYmttLXNlYXJjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTSxTOzs7Ozs7O3FDQUNpQjtBQUNmLFdBQUssRUFBTCxHQUFVLFlBQVY7O0FBRUEsV0FBSyxVQUFMLEdBQWtCO0FBQ2hCLGdCQUFRO0FBQ04sZ0JBQU0sS0FEQTtBQUVOLGlCQUFPO0FBRkQsU0FEUTs7QUFNaEIsY0FBTTtBQUNKLGdCQUFNLE1BREY7QUFFSixpQkFBTztBQUZILFNBTlU7O0FBV2hCLHFCQUFhO0FBQ1gsZ0JBQU0sTUFESztBQUVYLGlCQUFPO0FBRkksU0FYRzs7QUFnQmhCLGVBQU87QUFDTCxnQkFBTSxNQUREO0FBRUwsaUJBQU87QUFGRixTQWhCUzs7QUFxQmhCLGlCQUFTO0FBQ1AsZ0JBQU0sTUFEQztBQUVQLGlCQUFPO0FBRkEsU0FyQk87O0FBMEJoQixlQUFPO0FBQ0wsZ0JBQU0sS0FERDtBQUVMLGlCQUFPO0FBRkYsU0ExQlM7O0FBK0JoQixXQUFHO0FBQ0QsZ0JBQU0sTUFETDtBQUVELGlCQUFPLEVBRk47QUFHRCxvQkFBVTtBQUhULFNBL0JhOztBQXFDaEIsa0JBQVU7QUFDUixnQkFBTSxNQURFO0FBRVIsaUJBQU87QUFGQyxTQXJDTTs7QUEwQ2hCLG9CQUFZO0FBQ1YsZ0JBQU0sT0FESTtBQUVWLGlCQUFPO0FBRkcsU0ExQ0k7O0FBK0NoQixvQkFBWTtBQUNWLGdCQUFNLE9BREk7QUFFVixpQkFBTztBQUZHLFNBL0NJOztBQW9EaEIsbUJBQVc7QUFDVCxnQkFBTSxPQURHO0FBRVQsaUJBQU87QUFGRSxTQXBESzs7QUF5RGhCLGNBQU07QUFDSixnQkFBTSxNQURGO0FBRUosaUJBQU87QUFGSDtBQXpEVSxPQUFsQjtBQThERDs7O21DQUVjLEksRUFBTTtBQUNuQixXQUFLLEdBQUwsQ0FBUyxVQUFULEVBQXFCLEtBQUssQ0FBMUI7QUFDQSxXQUFLLEdBQUwsQ0FBUyxhQUFULEVBQXdCLEtBQUssTUFBTCxDQUFZLE1BQXBDO0FBQ0EsV0FBSyxHQUFMLENBQVMsTUFBVCxFQUFpQixDQUFqQjtBQUNBLFdBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsS0FBSyxJQUFMLENBQVUsS0FBSyxNQUFMLENBQVksTUFBWixHQUFxQixLQUFLLE9BQXBDLENBQWxCO0FBQ0EsV0FBSyxHQUFMLENBQVMsYUFBVCxFQUF3QixLQUFLLElBQUwsR0FBWSxDQUFwQzs7QUFFQSxVQUFJLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsTUFBckIsR0FBOEIsQ0FBbEMsRUFBcUM7QUFDbkMsYUFBSyxXQUFMLENBQWlCLEtBQUssSUFBdEIsRUFBNEIsS0FBSyxPQUFqQztBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsRUFBbEI7QUFDRDs7QUFFRCxXQUFLLEdBQUwsQ0FBUyxZQUFULEVBQXVCLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsQ0FBM0M7QUFDRDs7O2dDQUVXLEksRUFBTSxPLEVBQVM7QUFDekIsY0FBUSxJQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEMsRUFBNEMsT0FBNUM7QUFDQSxXQUFLLEdBQUwsQ0FBUyxhQUFULEVBQXdCLEtBQUssSUFBTCxHQUFZLENBQXBDO0FBQ0EsVUFBSSxRQUFRLE9BQU8sT0FBbkI7QUFDQSxVQUFJLE1BQU0sUUFBUSxPQUFsQjtBQUNBLFdBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixLQUFsQixFQUF5QixHQUF6QixDQUFsQjtBQUNBLFdBQUssR0FBTCxDQUFTLFlBQVQsRUFBdUIsS0FBSyxJQUFMLElBQWEsQ0FBcEM7QUFDQSxXQUFLLEdBQUwsQ0FBUyxXQUFULEVBQXNCLEtBQUssTUFBTCxDQUFZLE1BQVosS0FBdUIsQ0FBdkIsSUFBNEIsS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixLQUFLLE9BQTNFO0FBQ0Q7OzsrQkFFVTtBQUNULFdBQUssR0FBTCxDQUFTLE1BQVQsRUFBaUIsMEJBQTBCLG1CQUFtQixLQUFLLENBQXhCLENBQTNDO0FBQ0Q7Ozs2QkFFUSxRLEVBQVUsUSxFQUFVO0FBQzNCLGNBQVEsSUFBUixDQUFhLHFCQUFiLEVBQW9DLFFBQXBDLEVBQThDLFFBQTlDO0FBRUQ7OzttQ0FFYztBQUNiLFdBQUssV0FBTCxDQUFpQixLQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsR0FBVSxDQUF2QyxFQUEwQyxLQUFLLE9BQS9DO0FBQ0Q7OzsrQkFFVTtBQUNULFdBQUssV0FBTCxDQUFpQixLQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsR0FBVSxDQUF2QyxFQUEwQyxLQUFLLE9BQS9DO0FBQ0Q7Ozs7OztBQUdILFFBQVEsU0FBUiIsImZpbGUiOiJlbGVtZW50cy9ia20tc2VhcmNoL2JrbS1zZWFyY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBCa21TZWFyY2gge1xuICAgICAgYmVmb3JlUmVnaXN0ZXIoKSB7XG4gICAgICAgIHRoaXMuaXMgPSAnYmttLXNlYXJjaCc7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0ge1xuICAgICAgICAgIGFsZXJ0czoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGFnZToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGFnZURpc3BsYXk6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHBhZ2VzOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBwZXJQYWdlOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogMTBcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICAgdmFsdWU6IFtdLFxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBxOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICBvYnNlcnZlcjogJ3FDaGFuZ2VkJ1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBjdXJyZW50UToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICcnXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGhhc1Jlc3VsdHM6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgX2ZpcnN0UGFnZToge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIF9sYXN0UGFnZToge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIF91cmw6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlUmVzcG9uc2UocmVzcCkge1xuICAgICAgICB0aGlzLnNldCgnY3VycmVudFEnLCB0aGlzLnEpO1xuICAgICAgICB0aGlzLnNldCgncmVzdWx0Q291bnQnLCB0aGlzLmFsZXJ0cy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnNldCgncGFnZScsIDApO1xuICAgICAgICB0aGlzLnNldCgncGFnZXMnLCBNYXRoLmNlaWwodGhpcy5hbGVydHMubGVuZ3RoIC8gdGhpcy5wZXJQYWdlKSk7XG4gICAgICAgIHRoaXMuc2V0KCdwYWdlRGlzcGxheScsIHRoaXMucGFnZSArIDEpO1xuXG4gICAgICAgIGlmIChyZXNwLmRldGFpbC5yZXNwb25zZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVJdGVtcyh0aGlzLnBhZ2UsIHRoaXMucGVyUGFnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXQoJ2l0ZW1zJywgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXQoJ2hhc1Jlc3VsdHMnLCB0aGlzLml0ZW1zLmxlbmd0aCA+IDApO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVJdGVtcyhwYWdlLCBwZXJQYWdlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygncGFnZTogJXMsIHBlclBhZ2U6ICVzJywgcGFnZSwgcGVyUGFnZSk7XG4gICAgICAgIHRoaXMuc2V0KCdwYWdlRGlzcGxheScsIHRoaXMucGFnZSArIDEpO1xuICAgICAgICBsZXQgc3RhcnQgPSBwYWdlICogcGVyUGFnZTtcbiAgICAgICAgbGV0IGVuZCA9IHN0YXJ0ICsgcGVyUGFnZTtcbiAgICAgICAgdGhpcy5zZXQoJ2l0ZW1zJywgdGhpcy5hbGVydHMuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuICAgICAgICB0aGlzLnNldCgnX2ZpcnN0UGFnZScsIHRoaXMucGFnZSA8PSAwKTtcbiAgICAgICAgdGhpcy5zZXQoJ19sYXN0UGFnZScsIHRoaXMuYWxlcnRzLmxlbmd0aCA9PT0gMCB8fCB0aGlzLml0ZW1zLmxlbmd0aCA8IHRoaXMucGVyUGFnZSk7XG4gICAgICB9XG5cbiAgICAgIGRvU2VhcmNoKCkge1xuICAgICAgICB0aGlzLnNldCgnX3VybCcsICdyZWNvcmQvc2VhcmNoP3NlYXJjaD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMucSkpO1xuICAgICAgfVxuXG4gICAgICBxQ2hhbmdlZChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdxIHVwZGF0ZWQ6ICVzIC0+ICVzJywgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICBcbiAgICAgIH1cblxuICAgICAgcHJldmlvdXNQYWdlKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1zKHRoaXMucGFnZSA9IHRoaXMucGFnZS0xLCB0aGlzLnBlclBhZ2UpOyAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIG5leHRQYWdlKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1zKHRoaXMucGFnZSA9IHRoaXMucGFnZSsxLCB0aGlzLnBlclBhZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIFBvbHltZXIoQmttU2VhcmNoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
