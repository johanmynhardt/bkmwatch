'use strict';

(function () {
  Polymer({
    is: 'aca-search-result-counter',
    properties: {
      displayText: {
        type: String,
        computed: 'resultsText(resultText, totalElements, searchDuration)'
      },

      resultText: {
        type: String,
        value: 'Showing about {x} results ({y} seconds)'
      },

      searchDuration: {
        type: Number,
        value: 0
      },

      totalElements: {
        type: Number,
        value: 0
      }

    },

    resultsText: function resultsText(resultText, totalElements, searchDuration) {
      console.debug('resultText: %s, totalElements: %s, searchDuration: %s ms', resultText, totalElements, searchDuration);
      return _.template(resultText)({ x: totalElements, y: searchDuration / 1000 });
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1zZWFyY2gvYWNhLXNlYXJjaC1yZXN1bHQtY291bnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNOLFVBQVE7QUFDTixRQUFJLDJCQURFO0FBRU4sZ0JBQVk7QUFDVixtQkFBYTtBQUNYLGNBQU0sTUFESztBQUVYLGtCQUFVO0FBRkMsT0FESDs7QUFNVixrQkFBWTtBQUNWLGNBQU0sTUFESTtBQUVWLGVBQU87QUFGRyxPQU5GOztBQVdWLHNCQUFnQjtBQUNkLGNBQU0sTUFEUTtBQUVkLGVBQU87QUFGTyxPQVhOOztBQWdCVixxQkFBZTtBQUNiLGNBQU0sTUFETztBQUViLGVBQU87QUFGTTs7QUFoQkwsS0FGTjs7QUF5Qk4saUJBQWEscUJBQVMsVUFBVCxFQUFxQixhQUFyQixFQUFvQyxjQUFwQyxFQUFvRDtBQUMvRCxjQUFRLEtBQVIsQ0FBYywwREFBZCxFQUNJLFVBREosRUFDZ0IsYUFEaEIsRUFDK0IsY0FEL0I7QUFFQSxhQUFPLEVBQUUsUUFBRixDQUFXLFVBQVgsRUFBdUIsRUFBQyxHQUFHLGFBQUosRUFBbUIsR0FBSSxpQkFBaUIsSUFBeEMsRUFBdkIsQ0FBUDtBQUNEO0FBN0JLLEdBQVI7QUErQkQsQ0FoQ0wiLCJmaWxlIjoiZWxlbWVudHMvYWNhLXNlYXJjaC9hY2Etc2VhcmNoLXJlc3VsdC1jb3VudGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICAgUG9seW1lcih7XG4gICAgICAgIGlzOiAnYWNhLXNlYXJjaC1yZXN1bHQtY291bnRlcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBkaXNwbGF5VGV4dDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgY29tcHV0ZWQ6ICdyZXN1bHRzVGV4dChyZXN1bHRUZXh0LCB0b3RhbEVsZW1lbnRzLCBzZWFyY2hEdXJhdGlvbiknXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHJlc3VsdFRleHQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnU2hvd2luZyBhYm91dCB7eH0gcmVzdWx0cyAoe3l9IHNlY29uZHMpJ1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBzZWFyY2hEdXJhdGlvbjoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgdG90YWxFbGVtZW50czoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICByZXN1bHRzVGV4dDogZnVuY3Rpb24ocmVzdWx0VGV4dCwgdG90YWxFbGVtZW50cywgc2VhcmNoRHVyYXRpb24pIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdyZXN1bHRUZXh0OiAlcywgdG90YWxFbGVtZW50czogJXMsIHNlYXJjaER1cmF0aW9uOiAlcyBtcycsXG4gICAgICAgICAgICAgIHJlc3VsdFRleHQsIHRvdGFsRWxlbWVudHMsIHNlYXJjaER1cmF0aW9uKTtcbiAgICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZShyZXN1bHRUZXh0KSh7eDogdG90YWxFbGVtZW50cywgeTogKHNlYXJjaER1cmF0aW9uIC8gMTAwMCl9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
