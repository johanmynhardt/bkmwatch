'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-autocomplete-overlay',

    properties: {
      items: {
        type: Array,
        value: []
      },
      input: {
        type: Object,
        value: undefined
      }
    },

    observers: ['itemsChange(items)'],

    behaviors: [Polymer.IronOverlayBehavior],

    listeners: {
      'iron-select': 'onIronSelect'
    },

    onIronSelect: function onIronSelect() {

      var selection = this.items[this.$.listbox.selected];

      console.log('onIronSelect...:', selection);

      this.$.listbox.selected = undefined;

      this.fire('iron-signal', {
        name: 'add-autocomplete-item',
        data: {
          for: this.for,
          item: selection
        }
      });

      this.close();
    },

    itemsChange: function itemsChange(newValues) {
      if (this.open && _.isEmpty(newValues)) {
        this.close();
      } else if (this.close && !_.isEmpty(newValues)) {
        this.open();
      }
    }

  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1hdXRvY29tcGxldGUtaW5wdXQvYWNhLWF1dG9jb21wbGV0ZS1vdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxZQUFXO0FBQ1I7O0FBRUEsVUFBUTtBQUNOLFFBQUksMEJBREU7O0FBR04sZ0JBQVk7QUFDVixhQUFPO0FBQ0wsY0FBTSxLQUREO0FBRUwsZUFBTztBQUZGLE9BREc7QUFLVixhQUFPO0FBQ0wsY0FBTSxNQUREO0FBRUwsZUFBTztBQUZGO0FBTEcsS0FITjs7QUFjTixlQUFXLENBQ1Qsb0JBRFMsQ0FkTDs7QUFrQk4sZUFBVyxDQUNULFFBQVEsbUJBREMsQ0FsQkw7O0FBc0JOLGVBQVc7QUFDVCxxQkFBZTtBQUROLEtBdEJMOztBQTBCTixrQkFBYyx3QkFBVzs7QUFFdkIsVUFBSSxZQUFZLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBTCxDQUFPLE9BQVAsQ0FBZSxRQUExQixDQUFoQjs7QUFFQSxjQUFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxTQUFoQzs7QUFFQSxXQUFLLENBQUwsQ0FBTyxPQUFQLENBQWUsUUFBZixHQUEwQixTQUExQjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCO0FBQ3ZCLGNBQU0sdUJBRGlCO0FBRXZCLGNBQU07QUFDSixlQUFLLEtBQUssR0FETjtBQUVKLGdCQUFNO0FBRkY7QUFGaUIsT0FBekI7O0FBUUEsV0FBSyxLQUFMO0FBQ0QsS0EzQ0s7O0FBNkNOLGlCQUFhLHFCQUFTLFNBQVQsRUFBb0I7QUFDL0IsVUFBSSxLQUFLLElBQUwsSUFBYSxFQUFFLE9BQUYsQ0FBVSxTQUFWLENBQWpCLEVBQXVDO0FBQ3JDLGFBQUssS0FBTDtBQUNELE9BRkQsTUFFTyxJQUFJLEtBQUssS0FBTCxJQUFjLENBQUMsRUFBRSxPQUFGLENBQVUsU0FBVixDQUFuQixFQUF5QztBQUM5QyxhQUFLLElBQUw7QUFDRDtBQUNGOztBQW5ESyxHQUFSO0FBc0RELENBekRIIiwiZmlsZSI6ImVsZW1lbnRzL2FjYS1hdXRvY29tcGxldGUtaW5wdXQvYWNhLWF1dG9jb21wbGV0ZS1vdmVybGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIFBvbHltZXIoe1xuICAgICAgaXM6ICdhY2EtYXV0b2NvbXBsZXRlLW92ZXJsYXknLFxuXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgICAgdmFsdWU6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgb2JzZXJ2ZXJzOiBbXG4gICAgICAgICdpdGVtc0NoYW5nZShpdGVtcyknXG4gICAgICBdLFxuXG4gICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgUG9seW1lci5Jcm9uT3ZlcmxheUJlaGF2aW9yXG4gICAgICBdLFxuXG4gICAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgJ2lyb24tc2VsZWN0JzogJ29uSXJvblNlbGVjdCdcbiAgICAgIH0sXG5cbiAgICAgIG9uSXJvblNlbGVjdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHRoaXMuaXRlbXNbdGhpcy4kLmxpc3Rib3guc2VsZWN0ZWRdO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdvbklyb25TZWxlY3QuLi46Jywgc2VsZWN0aW9uKTtcblxuICAgICAgICB0aGlzLiQubGlzdGJveC5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLmZpcmUoJ2lyb24tc2lnbmFsJywge1xuICAgICAgICAgIG5hbWU6ICdhZGQtYXV0b2NvbXBsZXRlLWl0ZW0nLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZvcjogdGhpcy5mb3IsXG4gICAgICAgICAgICBpdGVtOiBzZWxlY3Rpb25cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0sXG5cbiAgICAgIGl0ZW1zQ2hhbmdlOiBmdW5jdGlvbihuZXdWYWx1ZXMpIHtcbiAgICAgICAgaWYgKHRoaXMub3BlbiAmJiBfLmlzRW1wdHkobmV3VmFsdWVzKSkge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNsb3NlICYmICFfLmlzRW1wdHkobmV3VmFsdWVzKSkge1xuICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgfSk7XG4gIH0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
