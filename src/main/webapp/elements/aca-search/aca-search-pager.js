'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-search-pager',
    properties: {
      page: {
        type: Number,
        value: 0
      },
      pages: {
        type: Number,
        value: 0,
        notify: true
      },
      hasPrevious: {
        type: Boolean
      },
      hasNext: {
        type: Boolean
      }
    },
    manyPages: function manyPages(pages) {
      //console.log('pages: ', pages);
      return pages > 1;
    },
    displayPage: function displayPage(page) {
      //console.log('page: ', page+1);
      return page + 1;
    },
    sendSignal: function sendSignal(signal) {
      var data = { name: signal, data: 'echo' };
      //console.log('firing iron-signal: ', data);
      this.fire('iron-signal', data);
    },
    signalPrevious: function signalPrevious() {
      this.sendSignal('page-previous');
    },
    signalNext: function signalNext() {
      this.sendSignal('page-next');
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1zZWFyY2gvYWNhLXNlYXJjaC1wYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNOOztBQUVBLFVBQVE7QUFDTixRQUFJLGtCQURFO0FBRU4sZ0JBQVk7QUFDVixZQUFNO0FBQ0osY0FBTSxNQURGO0FBRUosZUFBTztBQUZILE9BREk7QUFLVixhQUFPO0FBQ0wsY0FBTSxNQUREO0FBRUwsZUFBTyxDQUZGO0FBR0wsZ0JBQVE7QUFISCxPQUxHO0FBVVYsbUJBQWE7QUFDWCxjQUFNO0FBREssT0FWSDtBQWFWLGVBQVM7QUFDUCxjQUFNO0FBREM7QUFiQyxLQUZOO0FBbUJOLGVBQVcsbUJBQVMsS0FBVCxFQUFnQjtBQUN6QjtBQUNBLGFBQU8sUUFBUSxDQUFmO0FBQ0QsS0F0Qks7QUF1Qk4saUJBQWEscUJBQVMsSUFBVCxFQUFlO0FBQzFCO0FBQ0EsYUFBTyxPQUFPLENBQWQ7QUFDRCxLQTFCSztBQTJCTixnQkFBWSxvQkFBUyxNQUFULEVBQWlCO0FBQzNCLFVBQUksT0FBTyxFQUFDLE1BQU0sTUFBUCxFQUFlLE1BQU0sTUFBckIsRUFBWDtBQUNBO0FBQ0EsV0FBSyxJQUFMLENBQVUsYUFBVixFQUF5QixJQUF6QjtBQUNELEtBL0JLO0FBZ0NOLG9CQUFnQiwwQkFBVztBQUN6QixXQUFLLFVBQUwsQ0FBZ0IsZUFBaEI7QUFDRCxLQWxDSztBQW1DTixnQkFBWSxzQkFBVztBQUNyQixXQUFLLFVBQUwsQ0FBZ0IsV0FBaEI7QUFDRDtBQXJDSyxHQUFSO0FBdUNELENBMUNMIiwiZmlsZSI6ImVsZW1lbnRzL2FjYS1zZWFyY2gvYWNhLXNlYXJjaC1wYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgUG9seW1lcih7XG4gICAgICAgIGlzOiAnYWNhLXNlYXJjaC1wYWdlcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBwYWdlOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGFnZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgbm90aWZ5OiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBoYXNQcmV2aW91czoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhblxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGFzTmV4dDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhblxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWFueVBhZ2VzOiBmdW5jdGlvbihwYWdlcykge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ3BhZ2VzOiAnLCBwYWdlcyk7XG4gICAgICAgICAgcmV0dXJuIHBhZ2VzID4gMTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlzcGxheVBhZ2U6IGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdwYWdlOiAnLCBwYWdlKzEpO1xuICAgICAgICAgIHJldHVybiBwYWdlICsgMTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VuZFNpZ25hbDogZnVuY3Rpb24oc2lnbmFsKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSB7bmFtZTogc2lnbmFsLCBkYXRhOiAnZWNobyd9O1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZpcmluZyBpcm9uLXNpZ25hbDogJywgZGF0YSk7XG4gICAgICAgICAgdGhpcy5maXJlKCdpcm9uLXNpZ25hbCcsIGRhdGEpO1xuICAgICAgICB9LFxuICAgICAgICBzaWduYWxQcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5zZW5kU2lnbmFsKCdwYWdlLXByZXZpb3VzJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNpZ25hbE5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuc2VuZFNpZ25hbCgncGFnZS1uZXh0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
