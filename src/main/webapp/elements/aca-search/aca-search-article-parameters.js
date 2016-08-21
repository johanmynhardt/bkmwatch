'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-search-article-parameters',

    properties: {
      titles: {
        type: Array,
        value: []
      },
      selected: {
        type: Object,
        value: { id: 'all', value: 'None Selected (All)' },
        notify: true,
        observer: 'selectedChanged'
      }
    },

    selectedChanged: function selectedChanged(newSelection) {
      if (newSelection !== null && newSelection !== undefined) {
        console.log('title selected: ', newSelection);
        console.log('selected: ', this.$.listbox.selected);
      }
    },

    showTitleSelector: function showTitleSelector() {
      console.log('display titleSelector');

      var newTitles = [];

      for (var i = 0; i < 20; i++) {
        newTitles.push('item ' + i);
      }

      this.titles = newTitles;

      this.$.titleSelector.open();
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1zZWFyY2gvYWNhLXNlYXJjaC1hcnRpY2xlLXBhcmFtZXRlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFlBQVc7QUFDTjs7QUFFQSxVQUFRO0FBQ04sUUFBSSwrQkFERTs7QUFHTixnQkFBWTtBQUNWLGNBQVE7QUFDTixjQUFNLEtBREE7QUFFTixlQUFPO0FBRkQsT0FERTtBQUtWLGdCQUFVO0FBQ1IsY0FBTSxNQURFO0FBRVIsZUFBTyxFQUFDLElBQUksS0FBTCxFQUFZLE9BQU8scUJBQW5CLEVBRkM7QUFHUixnQkFBUSxJQUhBO0FBSVIsa0JBQVU7QUFKRjtBQUxBLEtBSE47O0FBZ0JOLHFCQUFpQix5QkFBUyxZQUFULEVBQXVCO0FBQ3RDLFVBQUksaUJBQWlCLElBQWpCLElBQXlCLGlCQUFpQixTQUE5QyxFQUF5RDtBQUN2RCxnQkFBUSxHQUFSLENBQVksa0JBQVosRUFBZ0MsWUFBaEM7QUFDQSxnQkFBUSxHQUFSLENBQVksWUFBWixFQUEwQixLQUFLLENBQUwsQ0FBTyxPQUFQLENBQWUsUUFBekM7QUFDRDtBQUNGLEtBckJLOztBQXVCTix1QkFBbUIsNkJBQVc7QUFDNUIsY0FBUSxHQUFSLENBQVksdUJBQVo7O0FBRUEsVUFBSSxZQUFZLEVBQWhCOztBQUVBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFwQixFQUF3QixHQUF4QixFQUE2QjtBQUMzQixrQkFBVSxJQUFWLENBQWUsVUFBVSxDQUF6QjtBQUNEOztBQUVELFdBQUssTUFBTCxHQUFjLFNBQWQ7O0FBRUEsV0FBSyxDQUFMLENBQU8sYUFBUCxDQUFxQixJQUFyQjtBQUNEO0FBbkNLLEdBQVI7QUFxQ0QsQ0F4Q0wiLCJmaWxlIjoiZWxlbWVudHMvYWNhLXNlYXJjaC9hY2Etc2VhcmNoLWFydGljbGUtcGFyYW1ldGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgUG9seW1lcih7XG4gICAgICAgIGlzOiAnYWNhLXNlYXJjaC1hcnRpY2xlLXBhcmFtZXRlcnMnLFxuXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0aXRsZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICAgdmFsdWU6IFtdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZWxlY3RlZDoge1xuICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgdmFsdWU6IHtpZDogJ2FsbCcsIHZhbHVlOiAnTm9uZSBTZWxlY3RlZCAoQWxsKSd9LFxuICAgICAgICAgICAgbm90aWZ5OiB0cnVlLFxuICAgICAgICAgICAgb2JzZXJ2ZXI6ICdzZWxlY3RlZENoYW5nZWQnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNlbGVjdGVkQ2hhbmdlZDogZnVuY3Rpb24obmV3U2VsZWN0aW9uKSB7XG4gICAgICAgICAgaWYgKG5ld1NlbGVjdGlvbiAhPT0gbnVsbCAmJiBuZXdTZWxlY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RpdGxlIHNlbGVjdGVkOiAnLCBuZXdTZWxlY3Rpb24pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkOiAnLCB0aGlzLiQubGlzdGJveC5zZWxlY3RlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dUaXRsZVNlbGVjdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGlzcGxheSB0aXRsZVNlbGVjdG9yJyk7XG5cbiAgICAgICAgICB2YXIgbmV3VGl0bGVzID0gW107XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAgICAgICAgIG5ld1RpdGxlcy5wdXNoKCdpdGVtICcgKyBpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnRpdGxlcyA9IG5ld1RpdGxlcztcblxuICAgICAgICAgIHRoaXMuJC50aXRsZVNlbGVjdG9yLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
