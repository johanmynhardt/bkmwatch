'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BkmBrowse = function () {
  function BkmBrowse() {
    _classCallCheck(this, BkmBrowse);
  }

  _createClass(BkmBrowse, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'bkm-browse';

      this.properties = {
        alerts: {
          type: Array,
          value: []
        },
        page: {
          type: Number,
          value: 0,
          observer: '_pageChanged'
        },
        perPage: {
          type: Number,
          value: 10,
          observer: '_perPageChanged'
        },

        _firstPage: {
          type: Boolean,
          value: true
        },

        _lastPage: {
          type: Boolean,
          value: false
        },

        _url: {
          type: String,
          value: undefined
        }
      };
    }
  }, {
    key: 'created',
    value: function created() {}
  }, {
    key: 'ready',
    value: function ready() {
      //this.beta = ['a', 'b', 'c'].map((x) => '_' + x);
    }
  }, {
    key: 'attached',
    value: function attached() {}
  }, {
    key: 'detached',
    value: function detached() {}
  }, {
    key: 'attributeChanged',
    value: function attributeChanged() {}
  }, {
    key: 'handleResponse',
    value: function handleResponse() {
      this._firstPage = parseInt(this.page) === 0;
      this._lastPage = this.alerts.length < this.perPage;
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      var next = this._join(['/browse/', parseInt(this.page) + 1, '?perPage=', parseInt(this.perPage)]);
      page.redirect(next);
    }
  }, {
    key: 'previousPage',
    value: function previousPage() {
      var previous = this._join(['/browse/', parseInt(this.page) - 1, '?perPage=', parseInt(this.perPage)]);
      page.redirect(previous);
    }
  }, {
    key: '_updateUrl',
    value: function _updateUrl(page, perPage) {
      // /record/alerts?page=[[page]]&amp;itemsPerPage=[[perPage]]
      console.info('page: %s, perPage: %s', page, perPage);
      if (page !== undefined && perPage !== undefined) {
        this._url = 'record/alerts?page=' + page + '&itemsPerPage=' + perPage;

        console.info('alerts: %s, perPage: %s', this.alerts.length, this.perPage);
      } else {
        console.info('not submitting url update: page=%s, perPage=%s', page, perPage);
      }
    }
  }, {
    key: '_pageChanged',
    value: function _pageChanged(newPage) {
      console.info('newPage: ', newPage);
      this._updateUrl(newPage, this.perPage);
    }
  }, {
    key: '_perPageChanged',
    value: function _perPageChanged(newPerPage) {
      console.info('newPerPage: ', newPerPage);
      this._updateUrl(this.page, this.perPage);
    }
  }, {
    key: '_join',
    value: function _join(items) {
      return items.reduce(function (a, b) {
        return a + b;
      });
    }
  }]);

  return BkmBrowse;
}();

Polymer(BkmBrowse);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2JrbS1icm93c2UvYmttLWJyb3dzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTSxTOzs7Ozs7O3FDQUNpQjtBQUNmLFdBQUssRUFBTCxHQUFVLFlBQVY7O0FBRUEsV0FBSyxVQUFMLEdBQWtCO0FBQ2hCLGdCQUFRO0FBQ04sZ0JBQU0sS0FEQTtBQUVOLGlCQUFPO0FBRkQsU0FEUTtBQUtoQixjQUFNO0FBQ0osZ0JBQU0sTUFERjtBQUVKLGlCQUFPLENBRkg7QUFHSixvQkFBVTtBQUhOLFNBTFU7QUFVaEIsaUJBQVM7QUFDUCxnQkFBTSxNQURDO0FBRVAsaUJBQU8sRUFGQTtBQUdQLG9CQUFVO0FBSEgsU0FWTzs7QUFnQmhCLG9CQUFZO0FBQ1YsZ0JBQU0sT0FESTtBQUVWLGlCQUFPO0FBRkcsU0FoQkk7O0FBcUJoQixtQkFBVztBQUNULGdCQUFNLE9BREc7QUFFVCxpQkFBTztBQUZFLFNBckJLOztBQTBCaEIsY0FBTTtBQUNKLGdCQUFNLE1BREY7QUFFSixpQkFBTztBQUZIO0FBMUJVLE9BQWxCO0FBK0JEOzs7OEJBRVMsQ0FDVDs7OzRCQUVPO0FBQ047QUFDRDs7OytCQUVVLENBQ1Y7OzsrQkFFVSxDQUNWOzs7dUNBRWtCLENBQ2xCOzs7cUNBRWdCO0FBQ2YsV0FBSyxVQUFMLEdBQWtCLFNBQVMsS0FBSyxJQUFkLE1BQXdCLENBQTFDO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLEtBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsS0FBSyxPQUEzQztBQUNEOzs7K0JBRVU7QUFDVCxVQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsQ0FBQyxVQUFELEVBQWMsU0FBUyxLQUFLLElBQWQsSUFBb0IsQ0FBbEMsRUFBc0MsV0FBdEMsRUFBbUQsU0FBUyxLQUFLLE9BQWQsQ0FBbkQsQ0FBWCxDQUFYO0FBQ0EsV0FBSyxRQUFMLENBQWMsSUFBZDtBQUNEOzs7bUNBRWM7QUFDYixVQUFJLFdBQVcsS0FBSyxLQUFMLENBQVcsQ0FBQyxVQUFELEVBQWMsU0FBUyxLQUFLLElBQWQsSUFBb0IsQ0FBbEMsRUFBc0MsV0FBdEMsRUFBbUQsU0FBUyxLQUFLLE9BQWQsQ0FBbkQsQ0FBWCxDQUFmO0FBQ0EsV0FBSyxRQUFMLENBQWMsUUFBZDtBQUNEOzs7K0JBRVUsSSxFQUFNLE8sRUFBUztBQUN4QjtBQUNBLGNBQVEsSUFBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDLEVBQTRDLE9BQTVDO0FBQ0EsVUFBSSxTQUFTLFNBQVQsSUFBc0IsWUFBWSxTQUF0QyxFQUFpRDtBQUMvQyxhQUFLLElBQUwsR0FBWSx3QkFBd0IsSUFBeEIsR0FBK0IsZ0JBQS9CLEdBQWtELE9BQTlEOztBQUdBLGdCQUFRLElBQVIsQ0FBYSx5QkFBYixFQUF3QyxLQUFLLE1BQUwsQ0FBWSxNQUFwRCxFQUE0RCxLQUFLLE9BQWpFO0FBQ0QsT0FMRCxNQUtPO0FBQ0wsZ0JBQVEsSUFBUixDQUFhLGdEQUFiLEVBQStELElBQS9ELEVBQXFFLE9BQXJFO0FBQ0Q7QUFDRjs7O2lDQUVZLE8sRUFBUztBQUNwQixjQUFRLElBQVIsQ0FBYSxXQUFiLEVBQTBCLE9BQTFCO0FBQ0EsV0FBSyxVQUFMLENBQWdCLE9BQWhCLEVBQXlCLEtBQUssT0FBOUI7QUFDRDs7O29DQUVlLFUsRUFBWTtBQUMxQixjQUFRLElBQVIsQ0FBYSxjQUFiLEVBQTZCLFVBQTdCO0FBQ0EsV0FBSyxVQUFMLENBQWdCLEtBQUssSUFBckIsRUFBMkIsS0FBSyxPQUFoQztBQUNEOzs7MEJBRUssSyxFQUFPO0FBQ1gsYUFBTyxNQUFNLE1BQU4sQ0FBYSxVQUFDLENBQUQsRUFBRyxDQUFIO0FBQUEsZUFBUyxJQUFJLENBQWI7QUFBQSxPQUFiLENBQVA7QUFDRDs7Ozs7O0FBR0gsUUFBUSxTQUFSIiwiZmlsZSI6ImVsZW1lbnRzL2JrbS1icm93c2UvYmttLWJyb3dzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJrbUJyb3dzZSB7XG4gICAgICBiZWZvcmVSZWdpc3RlcigpIHtcbiAgICAgICAgdGhpcy5pcyA9ICdia20tYnJvd3NlJztcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSB7XG4gICAgICAgICAgYWxlcnRzOiB7XG4gICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgIHZhbHVlOiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGFnZToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBvYnNlcnZlcjogJ19wYWdlQ2hhbmdlZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBlclBhZ2U6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHZhbHVlOiAxMCxcbiAgICAgICAgICAgIG9ic2VydmVyOiAnX3BlclBhZ2VDaGFuZ2VkJ1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBfZmlyc3RQYWdlOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgdmFsdWU6IHRydWVcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgX2xhc3RQYWdlOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgdmFsdWU6IGZhbHNlXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIF91cmw6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGNyZWF0ZWQoKSB7XG4gICAgICB9XG5cbiAgICAgIHJlYWR5KCkge1xuICAgICAgICAvL3RoaXMuYmV0YSA9IFsnYScsICdiJywgJ2MnXS5tYXAoKHgpID0+ICdfJyArIHgpO1xuICAgICAgfVxuXG4gICAgICBhdHRhY2hlZCgpIHtcbiAgICAgIH1cblxuICAgICAgZGV0YWNoZWQoKSB7XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWQoKSB7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZVJlc3BvbnNlKCkge1xuICAgICAgICB0aGlzLl9maXJzdFBhZ2UgPSBwYXJzZUludCh0aGlzLnBhZ2UpID09PSAwO1xuICAgICAgICB0aGlzLl9sYXN0UGFnZSA9IHRoaXMuYWxlcnRzLmxlbmd0aCA8IHRoaXMucGVyUGFnZTtcbiAgICAgIH1cblxuICAgICAgbmV4dFBhZ2UoKSB7XG4gICAgICAgIGxldCBuZXh0ID0gdGhpcy5fam9pbihbJy9icm93c2UvJywgKHBhcnNlSW50KHRoaXMucGFnZSkrMSksICc/cGVyUGFnZT0nLCBwYXJzZUludCh0aGlzLnBlclBhZ2UpXSk7XG4gICAgICAgIHBhZ2UucmVkaXJlY3QobmV4dCk7XG4gICAgICB9XG5cbiAgICAgIHByZXZpb3VzUGFnZSgpIHtcbiAgICAgICAgbGV0IHByZXZpb3VzID0gdGhpcy5fam9pbihbJy9icm93c2UvJywgKHBhcnNlSW50KHRoaXMucGFnZSktMSksICc/cGVyUGFnZT0nLCBwYXJzZUludCh0aGlzLnBlclBhZ2UpXSk7XG4gICAgICAgIHBhZ2UucmVkaXJlY3QocHJldmlvdXMpO1xuICAgICAgfVxuXG4gICAgICBfdXBkYXRlVXJsKHBhZ2UsIHBlclBhZ2UpIHtcbiAgICAgICAgLy8gL3JlY29yZC9hbGVydHM/cGFnZT1bW3BhZ2VdXSZhbXA7aXRlbXNQZXJQYWdlPVtbcGVyUGFnZV1dXG4gICAgICAgIGNvbnNvbGUuaW5mbygncGFnZTogJXMsIHBlclBhZ2U6ICVzJywgcGFnZSwgcGVyUGFnZSk7XG4gICAgICAgIGlmIChwYWdlICE9PSB1bmRlZmluZWQgJiYgcGVyUGFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5fdXJsID0gJ3JlY29yZC9hbGVydHM/cGFnZT0nICsgcGFnZSArICcmaXRlbXNQZXJQYWdlPScgKyBwZXJQYWdlO1xuXG5cbiAgICAgICAgICBjb25zb2xlLmluZm8oJ2FsZXJ0czogJXMsIHBlclBhZ2U6ICVzJywgdGhpcy5hbGVydHMubGVuZ3RoLCB0aGlzLnBlclBhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuaW5mbygnbm90IHN1Ym1pdHRpbmcgdXJsIHVwZGF0ZTogcGFnZT0lcywgcGVyUGFnZT0lcycsIHBhZ2UsIHBlclBhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9wYWdlQ2hhbmdlZChuZXdQYWdlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnbmV3UGFnZTogJywgbmV3UGFnZSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVVybChuZXdQYWdlLCB0aGlzLnBlclBhZ2UpO1xuICAgICAgfVxuXG4gICAgICBfcGVyUGFnZUNoYW5nZWQobmV3UGVyUGFnZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJ25ld1BlclBhZ2U6ICcsIG5ld1BlclBhZ2UpO1xuICAgICAgICB0aGlzLl91cGRhdGVVcmwodGhpcy5wYWdlLCB0aGlzLnBlclBhZ2UpO1xuICAgICAgfVxuXG4gICAgICBfam9pbihpdGVtcykge1xuICAgICAgICByZXR1cm4gaXRlbXMucmVkdWNlKChhLGIpID0+IGEgKyBiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBQb2x5bWVyKEJrbUJyb3dzZSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
