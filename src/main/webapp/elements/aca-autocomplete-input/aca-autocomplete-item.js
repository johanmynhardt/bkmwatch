'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-autocomplete-item',

    removeAutocompleteItem: function removeAutocompleteItem() {
      this.fire('iron-signal', {
        name: 'remove-autocomplete-item',
        data: {
          for: this.for,
          item: this.item
        }
      });
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1hdXRvY29tcGxldGUtaW5wdXQvYWNhLWF1dG9jb21wbGV0ZS1pdGVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxZQUFXO0FBQ047O0FBRUEsVUFBUTtBQUNOLFFBQUksdUJBREU7O0FBR04sNEJBQXdCLGtDQUFXO0FBQ2pDLFdBQUssSUFBTCxDQUFVLGFBQVYsRUFBeUI7QUFDdkIsY0FBTSwwQkFEaUI7QUFFdkIsY0FBTTtBQUNKLGVBQUssS0FBSyxHQUROO0FBRUosZ0JBQU0sS0FBSztBQUZQO0FBRmlCLE9BQXpCO0FBT0Q7QUFYSyxHQUFSO0FBYUQsQ0FoQkwiLCJmaWxlIjoiZWxlbWVudHMvYWNhLWF1dG9jb21wbGV0ZS1pbnB1dC9hY2EtYXV0b2NvbXBsZXRlLWl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgIFBvbHltZXIoe1xuICAgICAgICBpczogJ2FjYS1hdXRvY29tcGxldGUtaXRlbScsXG5cbiAgICAgICAgcmVtb3ZlQXV0b2NvbXBsZXRlSXRlbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5maXJlKCdpcm9uLXNpZ25hbCcsIHtcbiAgICAgICAgICAgIG5hbWU6ICdyZW1vdmUtYXV0b2NvbXBsZXRlLWl0ZW0nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBmb3I6IHRoaXMuZm9yLFxuICAgICAgICAgICAgICBpdGVtOiB0aGlzLml0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
