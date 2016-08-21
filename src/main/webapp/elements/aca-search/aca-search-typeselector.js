'use strict';

(function () {
  Polymer({
    is: 'aca-search-typeselector',
    properties: {
      selected: {
        type: String,
        value: undefined,
        notify: true
      },
      types: {
        type: Array,
        value: []
      }
    },

    ready: function ready() {
      this._configUpdated();
    },

    _availableTypes: function _availableTypes() {
      // let's future-proof this thing!
      var availableTypes = [{
        type: 'type-image',
        icon: 'image:camera',
        label: 'Image'
      }, {
        type: 'type-video',
        icon: 'av:play-circle-outline',
        label: 'Video'
      }, {
        type: 'type-audio',
        icon: 'av:music-video',
        label: 'Audio'
      }, {
        type: 'type-article',
        icon: 'description',
        label: 'Article'
      }];

      var allowed = ['type-image', 'type-article', 'type-video'];

      var allowedFilter = function allowedFilter(types) {
        return function (current) {
          return _.includes(types, current.type);
        };
      };

      return _.chain(availableTypes).filter(allowedFilter(allowed)).value();
    },

    _changeSelection: function _changeSelection(event) {
      var target = event.target;
      var type = target.attributes.type;
      console.info('change: ', type);

      if (type) {
        this.selected = type.value;
      }
      _.each(target.parentNode.children, function (item) {
        return item.raised = _.isEqual(item, target);
      });
    },

    _configUpdated: function _configUpdated(event) {
      var _this = this;

      console.log('_configUpdated: ', event);

      var typeMap = {
        'type-media': ['type-image', 'type-audio', 'type-video'],
        'type-audio': ['type-audio'],
        'type-image': ['type-image'],
        'type-video': ['type-video'],
        'type-article': ['type-article']
      };

      if (_.hasIn(app, 'config.limitToType')) {
        (function () {
          var types = app.config.limitToType.split(',');
          if (_.includes(types, 'type-media')) {
            // use all media types instead
            types = typeMap['type-media'];
          }

          _this.types = _.filter(_this._availableTypes(), function (availableType) {
            return _.some(types, function (x) {
              return _.isEqual(x, availableType.type);
            });
          });
        })();
      } else {
        this.types = this._availableTypes();
      }

      if (_.map(this.types, 'type').length === 0) {
        console.error('types not expected to be empty!');
      }

      // Set first button raised
      Polymer.dom.flush();
      var firstButton = _.first(this.$.itemContainer.querySelectorAll('paper-button'));
      if (firstButton) {
        Polymer.dom(firstButton).setAttribute('raised');
        this.selected = firstButton.attributes.type.value;
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1zZWFyY2gvYWNhLXNlYXJjaC10eXBlc2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFlBQVc7QUFDTixVQUFRO0FBQ04sUUFBSSx5QkFERTtBQUVOLGdCQUFZO0FBQ1YsZ0JBQVU7QUFDUixjQUFNLE1BREU7QUFFUixlQUFPLFNBRkM7QUFHUixnQkFBUTtBQUhBLE9BREE7QUFNVixhQUFPO0FBQ0wsY0FBTSxLQUREO0FBRUwsZUFBTztBQUZGO0FBTkcsS0FGTjs7QUFjTixXQUFPLGlCQUFXO0FBQ2hCLFdBQUssY0FBTDtBQUNELEtBaEJLOztBQWtCTixxQkFBaUIsMkJBQVc7QUFDMUI7QUFDQSxVQUFNLGlCQUFpQixDQUNyQjtBQUNFLGNBQU0sWUFEUjtBQUVFLGNBQU0sY0FGUjtBQUdFLGVBQU87QUFIVCxPQURxQixFQU1yQjtBQUNFLGNBQU0sWUFEUjtBQUVFLGNBQU0sd0JBRlI7QUFHRSxlQUFPO0FBSFQsT0FOcUIsRUFXckI7QUFDRSxjQUFNLFlBRFI7QUFFRSxjQUFNLGdCQUZSO0FBR0UsZUFBTztBQUhULE9BWHFCLEVBZ0JyQjtBQUNFLGNBQU0sY0FEUjtBQUVFLGNBQU0sYUFGUjtBQUdFLGVBQU87QUFIVCxPQWhCcUIsQ0FBdkI7O0FBdUJBLFVBQU0sVUFBVSxDQUFDLFlBQUQsRUFBZSxjQUFmLEVBQStCLFlBQS9CLENBQWhCOztBQUVBLFVBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCO0FBQUEsZUFBUztBQUFBLGlCQUFXLEVBQUUsUUFBRixDQUFXLEtBQVgsRUFBa0IsUUFBUSxJQUExQixDQUFYO0FBQUEsU0FBVDtBQUFBLE9BQXRCOztBQUVBLGFBQU8sRUFBRSxLQUFGLENBQVEsY0FBUixFQUNGLE1BREUsQ0FDSyxjQUFjLE9BQWQsQ0FETCxFQUVGLEtBRkUsRUFBUDtBQUdELEtBbERLOztBQW9ETixzQkFBa0IsMEJBQVMsS0FBVCxFQUFnQjtBQUNoQyxVQUFJLFNBQVMsTUFBTSxNQUFuQjtBQUNBLFVBQUksT0FBTyxPQUFPLFVBQVAsQ0FBa0IsSUFBN0I7QUFDQSxjQUFRLElBQVIsQ0FBYSxVQUFiLEVBQXlCLElBQXpCOztBQUVBLFVBQUksSUFBSixFQUFVO0FBQ1IsYUFBSyxRQUFMLEdBQWdCLEtBQUssS0FBckI7QUFDRDtBQUNELFFBQUUsSUFBRixDQUFPLE9BQU8sVUFBUCxDQUFrQixRQUF6QixFQUFtQyxVQUFDLElBQUQ7QUFBQSxlQUFVLEtBQUssTUFBTCxHQUFjLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsTUFBaEIsQ0FBeEI7QUFBQSxPQUFuQztBQUNELEtBN0RLOztBQStETixvQkFBZ0Isd0JBQVMsS0FBVCxFQUFnQjtBQUFBOztBQUM5QixjQUFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxLQUFoQzs7QUFFQSxVQUFNLFVBQVU7QUFDZCxzQkFBYyxDQUNaLFlBRFksRUFFWixZQUZZLEVBR1osWUFIWSxDQURBO0FBTWQsc0JBQWMsQ0FBQyxZQUFELENBTkE7QUFPZCxzQkFBYyxDQUFDLFlBQUQsQ0FQQTtBQVFkLHNCQUFjLENBQUMsWUFBRCxDQVJBO0FBU2Qsd0JBQWdCLENBQUMsY0FBRDtBQVRGLE9BQWhCOztBQVlBLFVBQUksRUFBRSxLQUFGLENBQVEsR0FBUixFQUFhLG9CQUFiLENBQUosRUFBd0M7QUFBQTtBQUN0QyxjQUFJLFFBQVEsSUFBSSxNQUFKLENBQVcsV0FBWCxDQUF1QixLQUF2QixDQUE2QixHQUE3QixDQUFaO0FBQ0EsY0FBSSxFQUFFLFFBQUYsQ0FBVyxLQUFYLEVBQWtCLFlBQWxCLENBQUosRUFBcUM7QUFBRTtBQUNyQyxvQkFBUSxRQUFRLFlBQVIsQ0FBUjtBQUNEOztBQUVELGdCQUFLLEtBQUwsR0FBYSxFQUFFLE1BQUYsQ0FBUyxNQUFLLGVBQUwsRUFBVCxFQUFpQyxVQUFTLGFBQVQsRUFBd0I7QUFDcEUsbUJBQU8sRUFBRSxJQUFGLENBQU8sS0FBUCxFQUFjLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLHFCQUFPLEVBQUUsT0FBRixDQUFVLENBQVYsRUFBYSxjQUFjLElBQTNCLENBQVA7QUFDRCxhQUZNLENBQVA7QUFHRCxXQUpZLENBQWI7QUFOc0M7QUFXdkMsT0FYRCxNQVdPO0FBQ0wsYUFBSyxLQUFMLEdBQWEsS0FBSyxlQUFMLEVBQWI7QUFDRDs7QUFFRCxVQUFJLEVBQUUsR0FBRixDQUFNLEtBQUssS0FBWCxFQUFrQixNQUFsQixFQUEwQixNQUExQixLQUFxQyxDQUF6QyxFQUE0QztBQUMxQyxnQkFBUSxLQUFSLENBQWMsaUNBQWQ7QUFDRDs7QUFFRDtBQUNBLGNBQVEsR0FBUixDQUFZLEtBQVo7QUFDQSxVQUFJLGNBQWMsRUFBRSxLQUFGLENBQVEsS0FBSyxDQUFMLENBQU8sYUFBUCxDQUFxQixnQkFBckIsQ0FBc0MsY0FBdEMsQ0FBUixDQUFsQjtBQUNBLFVBQUksV0FBSixFQUFpQjtBQUNmLGdCQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLFlBQXpCLENBQXNDLFFBQXRDO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLFlBQVksVUFBWixDQUF1QixJQUF2QixDQUE0QixLQUE1QztBQUNEO0FBRUY7QUF6R0ssR0FBUjtBQTJHRCxDQTVHTCIsImZpbGUiOiJlbGVtZW50cy9hY2Etc2VhcmNoL2FjYS1zZWFyY2gtdHlwZXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICAgUG9seW1lcih7XG4gICAgICAgIGlzOiAnYWNhLXNlYXJjaC10eXBlc2VsZWN0b3InLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2VsZWN0ZWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHR5cGVzOiB7XG4gICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgIHZhbHVlOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5fY29uZmlnVXBkYXRlZCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9hdmFpbGFibGVUeXBlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gbGV0J3MgZnV0dXJlLXByb29mIHRoaXMgdGhpbmchXG4gICAgICAgICAgY29uc3QgYXZhaWxhYmxlVHlwZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0eXBlLWltYWdlJyxcbiAgICAgICAgICAgICAgaWNvbjogJ2ltYWdlOmNhbWVyYScsXG4gICAgICAgICAgICAgIGxhYmVsOiAnSW1hZ2UnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAndHlwZS12aWRlbycsXG4gICAgICAgICAgICAgIGljb246ICdhdjpwbGF5LWNpcmNsZS1vdXRsaW5lJyxcbiAgICAgICAgICAgICAgbGFiZWw6ICdWaWRlbydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0eXBlLWF1ZGlvJyxcbiAgICAgICAgICAgICAgaWNvbjogJ2F2Om11c2ljLXZpZGVvJyxcbiAgICAgICAgICAgICAgbGFiZWw6ICdBdWRpbydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0eXBlLWFydGljbGUnLFxuICAgICAgICAgICAgICBpY29uOiAnZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICBsYWJlbDogJ0FydGljbGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXTtcblxuICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBbJ3R5cGUtaW1hZ2UnLCAndHlwZS1hcnRpY2xlJywgJ3R5cGUtdmlkZW8nXTtcblxuICAgICAgICAgIGNvbnN0IGFsbG93ZWRGaWx0ZXIgPSB0eXBlcyA9PiBjdXJyZW50ID0+IF8uaW5jbHVkZXModHlwZXMsIGN1cnJlbnQudHlwZSk7XG5cbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihhdmFpbGFibGVUeXBlcylcbiAgICAgICAgICAgICAgLmZpbHRlcihhbGxvd2VkRmlsdGVyKGFsbG93ZWQpKVxuICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfY2hhbmdlU2VsZWN0aW9uOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgbGV0IHR5cGUgPSB0YXJnZXQuYXR0cmlidXRlcy50eXBlO1xuICAgICAgICAgIGNvbnNvbGUuaW5mbygnY2hhbmdlOiAnLCB0eXBlKTtcblxuICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHlwZS52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXy5lYWNoKHRhcmdldC5wYXJlbnROb2RlLmNoaWxkcmVuLCAoaXRlbSkgPT4gaXRlbS5yYWlzZWQgPSBfLmlzRXF1YWwoaXRlbSwgdGFyZ2V0KSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbmZpZ1VwZGF0ZWQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ19jb25maWdVcGRhdGVkOiAnLCBldmVudCk7XG5cbiAgICAgICAgICBjb25zdCB0eXBlTWFwID0ge1xuICAgICAgICAgICAgJ3R5cGUtbWVkaWEnOiBbXG4gICAgICAgICAgICAgICd0eXBlLWltYWdlJyxcbiAgICAgICAgICAgICAgJ3R5cGUtYXVkaW8nLFxuICAgICAgICAgICAgICAndHlwZS12aWRlbydcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAndHlwZS1hdWRpbyc6IFsndHlwZS1hdWRpbyddLFxuICAgICAgICAgICAgJ3R5cGUtaW1hZ2UnOiBbJ3R5cGUtaW1hZ2UnXSxcbiAgICAgICAgICAgICd0eXBlLXZpZGVvJzogWyd0eXBlLXZpZGVvJ10sXG4gICAgICAgICAgICAndHlwZS1hcnRpY2xlJzogWyd0eXBlLWFydGljbGUnXVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoXy5oYXNJbihhcHAsICdjb25maWcubGltaXRUb1R5cGUnKSkge1xuICAgICAgICAgICAgbGV0IHR5cGVzID0gYXBwLmNvbmZpZy5saW1pdFRvVHlwZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgaWYgKF8uaW5jbHVkZXModHlwZXMsICd0eXBlLW1lZGlhJykpIHsgLy8gdXNlIGFsbCBtZWRpYSB0eXBlcyBpbnN0ZWFkXG4gICAgICAgICAgICAgIHR5cGVzID0gdHlwZU1hcFsndHlwZS1tZWRpYSddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnR5cGVzID0gXy5maWx0ZXIodGhpcy5fYXZhaWxhYmxlVHlwZXMoKSwgZnVuY3Rpb24oYXZhaWxhYmxlVHlwZSkge1xuICAgICAgICAgICAgICByZXR1cm4gXy5zb21lKHR5cGVzLCBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uaXNFcXVhbCh4LCBhdmFpbGFibGVUeXBlLnR5cGUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnR5cGVzID0gdGhpcy5fYXZhaWxhYmxlVHlwZXMoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoXy5tYXAodGhpcy50eXBlcywgJ3R5cGUnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3R5cGVzIG5vdCBleHBlY3RlZCB0byBiZSBlbXB0eSEnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBTZXQgZmlyc3QgYnV0dG9uIHJhaXNlZFxuICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XG4gICAgICAgICAgbGV0IGZpcnN0QnV0dG9uID0gXy5maXJzdCh0aGlzLiQuaXRlbUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdwYXBlci1idXR0b24nKSk7XG4gICAgICAgICAgaWYgKGZpcnN0QnV0dG9uKSB7XG4gICAgICAgICAgICBQb2x5bWVyLmRvbShmaXJzdEJ1dHRvbikuc2V0QXR0cmlidXRlKCdyYWlzZWQnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmaXJzdEJ1dHRvbi5hdHRyaWJ1dGVzLnR5cGUudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
