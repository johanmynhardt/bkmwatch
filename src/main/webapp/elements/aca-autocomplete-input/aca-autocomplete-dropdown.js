'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-autocomplete-dropdown',

    properties: {
      items: {
        type: Array,
        value: []
      },
      input: {
        type: Object,
        value: undefined
      },
      open: {
        type: Boolean,
        value: false,
        notify: true
      }
    },

    observers: ['itemsChange(items)'],

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

      // TODO: This is potentially not required to close. Leave open for now.
      //this.$.dropdown.close();
    },

    itemsChange: function itemsChange(newValues) {
      if (this.$.dropdown.opened && _.isEmpty(newValues)) {
        this.$.dropdown.close();
      } else if (!this.$.dropdown.opened && !_.isEmpty(newValues)) {
        this.$.dropdown.open();
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1hdXRvY29tcGxldGUtaW5wdXQvYWNhLWF1dG9jb21wbGV0ZS1kcm9wZG93bi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNOOztBQUVBLFVBQVE7QUFDTixRQUFJLDJCQURFOztBQUdOLGdCQUFZO0FBQ1YsYUFBTztBQUNMLGNBQU0sS0FERDtBQUVMLGVBQU87QUFGRixPQURHO0FBS1YsYUFBTztBQUNMLGNBQU0sTUFERDtBQUVMLGVBQU87QUFGRixPQUxHO0FBU1YsWUFBTTtBQUNKLGNBQU0sT0FERjtBQUVKLGVBQU8sS0FGSDtBQUdKLGdCQUFRO0FBSEo7QUFUSSxLQUhOOztBQW1CTixlQUFXLENBQ1Qsb0JBRFMsQ0FuQkw7O0FBdUJOLGVBQVc7QUFDVCxxQkFBZTtBQUROLEtBdkJMOztBQTJCTixrQkFBYyx3QkFBVzs7QUFFdkIsVUFBSSxZQUFZLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBTCxDQUFPLE9BQVAsQ0FBZSxRQUExQixDQUFoQjs7QUFFQSxjQUFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxTQUFoQzs7QUFFQSxXQUFLLENBQUwsQ0FBTyxPQUFQLENBQWUsUUFBZixHQUEwQixTQUExQjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCO0FBQ3ZCLGNBQU0sdUJBRGlCO0FBRXZCLGNBQU07QUFDSixlQUFLLEtBQUssR0FETjtBQUVKLGdCQUFNO0FBRkY7QUFGaUIsT0FBekI7O0FBUUE7QUFDQTtBQUNELEtBN0NLOztBQStDTixpQkFBYSxxQkFBUyxTQUFULEVBQW9CO0FBQy9CLFVBQUksS0FBSyxDQUFMLENBQU8sUUFBUCxDQUFnQixNQUFoQixJQUEwQixFQUFFLE9BQUYsQ0FBVSxTQUFWLENBQTlCLEVBQW9EO0FBQ2xELGFBQUssQ0FBTCxDQUFPLFFBQVAsQ0FBZ0IsS0FBaEI7QUFDRCxPQUZELE1BRU8sSUFBSSxDQUFDLEtBQUssQ0FBTCxDQUFPLFFBQVAsQ0FBZ0IsTUFBakIsSUFBMkIsQ0FBQyxFQUFFLE9BQUYsQ0FBVSxTQUFWLENBQWhDLEVBQXNEO0FBQzNELGFBQUssQ0FBTCxDQUFPLFFBQVAsQ0FBZ0IsSUFBaEI7QUFDRDtBQUNGO0FBckRLLEdBQVI7QUF1REQsQ0ExREwiLCJmaWxlIjoiZWxlbWVudHMvYWNhLWF1dG9jb21wbGV0ZS1pbnB1dC9hY2EtYXV0b2NvbXBsZXRlLWRyb3Bkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICBQb2x5bWVyKHtcbiAgICAgICAgaXM6ICdhY2EtYXV0b2NvbXBsZXRlLWRyb3Bkb3duJyxcblxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICAgdmFsdWU6IFtdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3Blbjoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBvYnNlcnZlcnM6IFtcbiAgICAgICAgICAnaXRlbXNDaGFuZ2UoaXRlbXMpJ1xuICAgICAgICBdLFxuXG4gICAgICAgIGxpc3RlbmVyczoge1xuICAgICAgICAgICdpcm9uLXNlbGVjdCc6ICdvbklyb25TZWxlY3QnXG4gICAgICAgIH0sXG5cbiAgICAgICAgb25Jcm9uU2VsZWN0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSB0aGlzLml0ZW1zW3RoaXMuJC5saXN0Ym94LnNlbGVjdGVkXTtcblxuICAgICAgICAgIGNvbnNvbGUubG9nKCdvbklyb25TZWxlY3QuLi46Jywgc2VsZWN0aW9uKTtcblxuICAgICAgICAgIHRoaXMuJC5saXN0Ym94LnNlbGVjdGVkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgdGhpcy5maXJlKCdpcm9uLXNpZ25hbCcsIHtcbiAgICAgICAgICAgIG5hbWU6ICdhZGQtYXV0b2NvbXBsZXRlLWl0ZW0nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBmb3I6IHRoaXMuZm9yLFxuICAgICAgICAgICAgICBpdGVtOiBzZWxlY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFRPRE86IFRoaXMgaXMgcG90ZW50aWFsbHkgbm90IHJlcXVpcmVkIHRvIGNsb3NlLiBMZWF2ZSBvcGVuIGZvciBub3cuXG4gICAgICAgICAgLy90aGlzLiQuZHJvcGRvd24uY2xvc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtc0NoYW5nZTogZnVuY3Rpb24obmV3VmFsdWVzKSB7XG4gICAgICAgICAgaWYgKHRoaXMuJC5kcm9wZG93bi5vcGVuZWQgJiYgXy5pc0VtcHR5KG5ld1ZhbHVlcykpIHtcbiAgICAgICAgICAgIHRoaXMuJC5kcm9wZG93bi5jbG9zZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuJC5kcm9wZG93bi5vcGVuZWQgJiYgIV8uaXNFbXB0eShuZXdWYWx1ZXMpKSB7XG4gICAgICAgICAgICB0aGlzLiQuZHJvcGRvd24ub3BlbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
