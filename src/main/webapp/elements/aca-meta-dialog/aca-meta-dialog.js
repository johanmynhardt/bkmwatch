'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-meta-dialog',
    properties: {
      item: {
        type: Object,
        value: undefined
      },
      heading: {
        type: String,
        value: 'Details'
      },
      selectedTab: {
        type: Number,
        value: 0,
        notify: true
      },
      target: {
        type: Object,
        value: function value() {
          return this.$.detailsDialog;
        }
      },
      portrait: {
        type: Boolean,
        value: false,
        notify: true
      },
      direction: {
        type: String,
        value: ''
      },
      _imgStylePostImageLoad: {
        type: String,
        value: ''
      }
    },

    observers: ['itemChanged(item)'],

    itemChanged: function itemChanged() {
      this.selectedTab = 0;
      this.portrait = this._isPortrait();
    },

    _isPortrait: function _isPortrait() {
      return _.head(this.item.references).width < _.head(this.item.references).height;
    },

    displayFor: function displayFor(imageItem) {
      this.item = imageItem;
      this.directionClasses = this._classForLayoutDiv(this.portrait);
      //console.info('directionClasses: ', this.directionClasses);

      this.imageStyleString = this._styleForLayoutImage(this.portrait);
      //console.info('imageStyleString: ', this.imageStyleString);

      //          this.$.imageWrap.toggleClass('portrait', this.portrait);
      //          this.$.imageWrap.toggleClass('landscape', !this.portrait);

      this.$.detailsDialog.open();
      this.$.detailsDialog.refit();
    },

    _classForLayoutDiv: function _classForLayoutDiv(isPortrait) {
      return isPortrait ? 'layout horizontal' : 'layout vertical';
    },

    _styleBoundString: function _styleBoundString(val1, val2) {
      return this._computeDimForType(val1, val2, 'style');
    },

    _styleForLayoutImage: function _styleForLayoutImage(isPortrait) {
      return isPortrait ? this._styleBoundString(400, 600) : this._styleBoundString(600, 400);
    },

    _closeDialog: function _closeDialog() {
      this.$.detailsDialog.close();
    },

    _imageUrl: function _imageUrl(imageItem) {
      if (imageItem !== undefined) {
        return _.head(imageItem.references).imageURL;
      }
    },

    _irsDownload: function _irsDownload(imageItem) {
      return imgutils.irsDownload(app.config, this._imageUrl(imageItem));
    },

    _imageUrlForIron: function _imageUrlForIron(imageItem) {
      return _.template('{irsBase}/1/process/{dims}?source={source}')({
        irsBase: app.config.irsBase,
        dims: this._computeThumbDims(),
        source: this._imageUrl(imageItem)
      });
    },

    /* TODO: refactor into imgutils.js */
    _computeDimForType: function _computeDimForType(w, h, computeType) {
      var templateStringFor = function templateStringFor(computeType) {
        if (computeType === 'style') {
          return 'width: {w}px; height: {h}px;';
        } else {
          return '{w}x{h}';
        }
      };
      return _.template(templateStringFor(computeType))({ w: w, h: h });
    },

    /* TODO: refactor into imgutils.js */
    _computeThumbDims: function _computeThumbDims() {
      var intendedHeight = this.portrait ? 600 : 400;
      var scaledWidth = this.portrait ? 400 : 600;
      return _.template('{width}x{height}')({ width: scaledWidth, height: intendedHeight });
    },

    _nextTab: function _nextTab() {
      this.$.plainTabs.selectNext();
    },

    _previousTab: function _previousTab() {
      this.$.plainTabs.selectPrevious();
    },

    _stringify: function _stringify(imageItem) {
      return JSON.stringify(imageItem, null, ' ');
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1tZXRhLWRpYWxvZy9hY2EtbWV0YS1kaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFlBQVc7QUFDTjs7QUFFQSxVQUFRO0FBQ04sUUFBSSxpQkFERTtBQUVOLGdCQUFZO0FBQ1YsWUFBTTtBQUNKLGNBQU0sTUFERjtBQUVKLGVBQU87QUFGSCxPQURJO0FBS1YsZUFBUztBQUNQLGNBQU0sTUFEQztBQUVQLGVBQU87QUFGQSxPQUxDO0FBU1YsbUJBQWE7QUFDWCxjQUFNLE1BREs7QUFFWCxlQUFPLENBRkk7QUFHWCxnQkFBUTtBQUhHLE9BVEg7QUFjVixjQUFRO0FBQ04sY0FBTSxNQURBO0FBRU4sZUFBTyxpQkFBVztBQUNoQixpQkFBTyxLQUFLLENBQUwsQ0FBTyxhQUFkO0FBQ0Q7QUFKSyxPQWRFO0FBb0JWLGdCQUFVO0FBQ1IsY0FBTSxPQURFO0FBRVIsZUFBTyxLQUZDO0FBR1IsZ0JBQVE7QUFIQSxPQXBCQTtBQXlCVixpQkFBVztBQUNULGNBQU0sTUFERztBQUVULGVBQU87QUFGRSxPQXpCRDtBQTZCViw4QkFBd0I7QUFDdEIsY0FBTSxNQURnQjtBQUV0QixlQUFPO0FBRmU7QUE3QmQsS0FGTjs7QUFxQ04sZUFBVyxDQUNULG1CQURTLENBckNMOztBQXlDTixpQkFBYSx1QkFBVztBQUN0QixXQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsS0FBSyxXQUFMLEVBQWhCO0FBQ0QsS0E1Q0s7O0FBOENOLGlCQUFhLHVCQUFXO0FBQ3RCLGFBQU8sRUFBRSxJQUFGLENBQU8sS0FBSyxJQUFMLENBQVUsVUFBakIsRUFBNkIsS0FBN0IsR0FBcUMsRUFBRSxJQUFGLENBQU8sS0FBSyxJQUFMLENBQVUsVUFBakIsRUFBNkIsTUFBekU7QUFDRCxLQWhESzs7QUFrRE4sZ0JBQVksb0JBQVMsU0FBVCxFQUFvQjtBQUM5QixXQUFLLElBQUwsR0FBWSxTQUFaO0FBQ0EsV0FBSyxnQkFBTCxHQUF3QixLQUFLLGtCQUFMLENBQXdCLEtBQUssUUFBN0IsQ0FBeEI7QUFDQTs7QUFFQSxXQUFLLGdCQUFMLEdBQXdCLEtBQUssb0JBQUwsQ0FBMEIsS0FBSyxRQUEvQixDQUF4QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsV0FBSyxDQUFMLENBQU8sYUFBUCxDQUFxQixJQUFyQjtBQUNBLFdBQUssQ0FBTCxDQUFPLGFBQVAsQ0FBcUIsS0FBckI7QUFDRCxLQS9ESzs7QUFpRU4sd0JBQW9CLDRCQUFTLFVBQVQsRUFBcUI7QUFDdkMsYUFBTyxhQUFhLG1CQUFiLEdBQW1DLGlCQUExQztBQUNELEtBbkVLOztBQXFFTix1QkFBbUIsMkJBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7QUFDdEMsYUFBTyxLQUFLLGtCQUFMLENBQXdCLElBQXhCLEVBQThCLElBQTlCLEVBQW9DLE9BQXBDLENBQVA7QUFDRCxLQXZFSzs7QUF5RU4sMEJBQXNCLDhCQUFTLFVBQVQsRUFBcUI7QUFDekMsYUFBTyxhQUFhLEtBQUssaUJBQUwsQ0FBdUIsR0FBdkIsRUFBNEIsR0FBNUIsQ0FBYixHQUFnRCxLQUFLLGlCQUFMLENBQXVCLEdBQXZCLEVBQTRCLEdBQTVCLENBQXZEO0FBQ0QsS0EzRUs7O0FBNkVOLGtCQUFjLHdCQUFXO0FBQ3ZCLFdBQUssQ0FBTCxDQUFPLGFBQVAsQ0FBcUIsS0FBckI7QUFDRCxLQS9FSzs7QUFpRk4sZUFBVyxtQkFBUyxTQUFULEVBQW9CO0FBQzdCLFVBQUksY0FBYyxTQUFsQixFQUE2QjtBQUMzQixlQUFPLEVBQUUsSUFBRixDQUFPLFVBQVUsVUFBakIsRUFBNkIsUUFBcEM7QUFDRDtBQUNGLEtBckZLOztBQXVGTixrQkFBYyxzQkFBUyxTQUFULEVBQW9CO0FBQ2hDLGFBQU8sU0FBUyxXQUFULENBQXFCLElBQUksTUFBekIsRUFBaUMsS0FBSyxTQUFMLENBQWUsU0FBZixDQUFqQyxDQUFQO0FBQ0QsS0F6Rks7O0FBMkZOLHNCQUFrQiwwQkFBUyxTQUFULEVBQW9CO0FBQ3BDLGFBQU8sRUFBRSxRQUFGLENBQVcsNENBQVgsRUFBeUQ7QUFDOUQsaUJBQVMsSUFBSSxNQUFKLENBQVcsT0FEMEM7QUFFOUQsY0FBTSxLQUFLLGlCQUFMLEVBRndEO0FBRzlELGdCQUFRLEtBQUssU0FBTCxDQUFlLFNBQWY7QUFIc0QsT0FBekQsQ0FBUDtBQUtELEtBakdLOztBQW1HTjtBQUNBLHdCQUFvQiw0QkFBUyxDQUFULEVBQVksQ0FBWixFQUFlLFdBQWYsRUFBNEI7QUFDOUMsVUFBSSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQVMsV0FBVCxFQUFzQjtBQUM1QyxZQUFJLGdCQUFnQixPQUFwQixFQUE2QjtBQUMzQixpQkFBTyw4QkFBUDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLFNBQVA7QUFDRDtBQUNGLE9BTkQ7QUFPQSxhQUFPLEVBQUUsUUFBRixDQUFXLGtCQUFrQixXQUFsQixDQUFYLEVBQTJDLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxDQUFWLEVBQTNDLENBQVA7QUFDRCxLQTdHSzs7QUErR047QUFDQSx1QkFBbUIsNkJBQVc7QUFDNUIsVUFBSSxpQkFBaUIsS0FBSyxRQUFMLEdBQWdCLEdBQWhCLEdBQXNCLEdBQTNDO0FBQ0EsVUFBSSxjQUFjLEtBQUssUUFBTCxHQUFnQixHQUFoQixHQUFzQixHQUF4QztBQUNBLGFBQU8sRUFBRSxRQUFGLENBQVcsa0JBQVgsRUFBK0IsRUFBQyxPQUFPLFdBQVIsRUFBcUIsUUFBUSxjQUE3QixFQUEvQixDQUFQO0FBQ0QsS0FwSEs7O0FBc0hOLGNBQVUsb0JBQVc7QUFDbkIsV0FBSyxDQUFMLENBQU8sU0FBUCxDQUFpQixVQUFqQjtBQUNELEtBeEhLOztBQTBITixrQkFBYyx3QkFBVztBQUN2QixXQUFLLENBQUwsQ0FBTyxTQUFQLENBQWlCLGNBQWpCO0FBQ0QsS0E1SEs7O0FBOEhOLGdCQUFZLG9CQUFTLFNBQVQsRUFBb0I7QUFDOUIsYUFBTyxLQUFLLFNBQUwsQ0FBZSxTQUFmLEVBQTBCLElBQTFCLEVBQWdDLEdBQWhDLENBQVA7QUFDRDtBQWhJSyxHQUFSO0FBa0lELENBcklMIiwiZmlsZSI6ImVsZW1lbnRzL2FjYS1tZXRhLWRpYWxvZy9hY2EtbWV0YS1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgIFBvbHltZXIoe1xuICAgICAgICBpczogJ2FjYS1tZXRhLWRpYWxvZycsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkXG4gICAgICAgICAgfSxcbiAgICAgICAgICBoZWFkaW5nOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJ0RldGFpbHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZWxlY3RlZFRhYjoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kLmRldGFpbHNEaWFsb2c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3J0cmFpdDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlyZWN0aW9uOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJydcbiAgICAgICAgICB9LFxuICAgICAgICAgIF9pbWdTdHlsZVBvc3RJbWFnZUxvYWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBvYnNlcnZlcnM6IFtcbiAgICAgICAgICAnaXRlbUNoYW5nZWQoaXRlbSknXG4gICAgICAgIF0sXG5cbiAgICAgICAgaXRlbUNoYW5nZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUYWIgPSAwO1xuICAgICAgICAgIHRoaXMucG9ydHJhaXQgPSB0aGlzLl9pc1BvcnRyYWl0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2lzUG9ydHJhaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfLmhlYWQodGhpcy5pdGVtLnJlZmVyZW5jZXMpLndpZHRoIDwgXy5oZWFkKHRoaXMuaXRlbS5yZWZlcmVuY2VzKS5oZWlnaHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzcGxheUZvcjogZnVuY3Rpb24oaW1hZ2VJdGVtKSB7XG4gICAgICAgICAgdGhpcy5pdGVtID0gaW1hZ2VJdGVtO1xuICAgICAgICAgIHRoaXMuZGlyZWN0aW9uQ2xhc3NlcyA9IHRoaXMuX2NsYXNzRm9yTGF5b3V0RGl2KHRoaXMucG9ydHJhaXQpO1xuICAgICAgICAgIC8vY29uc29sZS5pbmZvKCdkaXJlY3Rpb25DbGFzc2VzOiAnLCB0aGlzLmRpcmVjdGlvbkNsYXNzZXMpO1xuXG4gICAgICAgICAgdGhpcy5pbWFnZVN0eWxlU3RyaW5nID0gdGhpcy5fc3R5bGVGb3JMYXlvdXRJbWFnZSh0aGlzLnBvcnRyYWl0KTtcbiAgICAgICAgICAvL2NvbnNvbGUuaW5mbygnaW1hZ2VTdHlsZVN0cmluZzogJywgdGhpcy5pbWFnZVN0eWxlU3RyaW5nKTtcblxuICAgICAgICAgIC8vICAgICAgICAgIHRoaXMuJC5pbWFnZVdyYXAudG9nZ2xlQ2xhc3MoJ3BvcnRyYWl0JywgdGhpcy5wb3J0cmFpdCk7XG4gICAgICAgICAgLy8gICAgICAgICAgdGhpcy4kLmltYWdlV3JhcC50b2dnbGVDbGFzcygnbGFuZHNjYXBlJywgIXRoaXMucG9ydHJhaXQpO1xuXG4gICAgICAgICAgdGhpcy4kLmRldGFpbHNEaWFsb2cub3BlbigpO1xuICAgICAgICAgIHRoaXMuJC5kZXRhaWxzRGlhbG9nLnJlZml0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsYXNzRm9yTGF5b3V0RGl2OiBmdW5jdGlvbihpc1BvcnRyYWl0KSB7XG4gICAgICAgICAgcmV0dXJuIGlzUG9ydHJhaXQgPyAnbGF5b3V0IGhvcml6b250YWwnIDogJ2xheW91dCB2ZXJ0aWNhbCc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3N0eWxlQm91bmRTdHJpbmc6IGZ1bmN0aW9uKHZhbDEsIHZhbDIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fY29tcHV0ZURpbUZvclR5cGUodmFsMSwgdmFsMiwgJ3N0eWxlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3N0eWxlRm9yTGF5b3V0SW1hZ2U6IGZ1bmN0aW9uKGlzUG9ydHJhaXQpIHtcbiAgICAgICAgICByZXR1cm4gaXNQb3J0cmFpdCA/IHRoaXMuX3N0eWxlQm91bmRTdHJpbmcoNDAwLCA2MDApIDogdGhpcy5fc3R5bGVCb3VuZFN0cmluZyg2MDAsIDQwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2Nsb3NlRGlhbG9nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLiQuZGV0YWlsc0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9pbWFnZVVybDogZnVuY3Rpb24oaW1hZ2VJdGVtKSB7XG4gICAgICAgICAgaWYgKGltYWdlSXRlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5oZWFkKGltYWdlSXRlbS5yZWZlcmVuY2VzKS5pbWFnZVVSTDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2lyc0Rvd25sb2FkOiBmdW5jdGlvbihpbWFnZUl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaW1ndXRpbHMuaXJzRG93bmxvYWQoYXBwLmNvbmZpZywgdGhpcy5faW1hZ2VVcmwoaW1hZ2VJdGVtKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2ltYWdlVXJsRm9ySXJvbjogZnVuY3Rpb24oaW1hZ2VJdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUoJ3tpcnNCYXNlfS8xL3Byb2Nlc3Mve2RpbXN9P3NvdXJjZT17c291cmNlfScpKHtcbiAgICAgICAgICAgIGlyc0Jhc2U6IGFwcC5jb25maWcuaXJzQmFzZSxcbiAgICAgICAgICAgIGRpbXM6IHRoaXMuX2NvbXB1dGVUaHVtYkRpbXMoKSxcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5faW1hZ2VVcmwoaW1hZ2VJdGVtKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIFRPRE86IHJlZmFjdG9yIGludG8gaW1ndXRpbHMuanMgKi9cbiAgICAgICAgX2NvbXB1dGVEaW1Gb3JUeXBlOiBmdW5jdGlvbih3LCBoLCBjb21wdXRlVHlwZSkge1xuICAgICAgICAgIHZhciB0ZW1wbGF0ZVN0cmluZ0ZvciA9IGZ1bmN0aW9uKGNvbXB1dGVUeXBlKSB7XG4gICAgICAgICAgICBpZiAoY29tcHV0ZVR5cGUgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICd3aWR0aDoge3d9cHg7IGhlaWdodDoge2h9cHg7JyA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gJ3t3fXh7aH0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUodGVtcGxhdGVTdHJpbmdGb3IoY29tcHV0ZVR5cGUpKSh7dzogdywgaDogaH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIFRPRE86IHJlZmFjdG9yIGludG8gaW1ndXRpbHMuanMgKi9cbiAgICAgICAgX2NvbXB1dGVUaHVtYkRpbXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBpbnRlbmRlZEhlaWdodCA9IHRoaXMucG9ydHJhaXQgPyA2MDAgOiA0MDA7XG4gICAgICAgICAgdmFyIHNjYWxlZFdpZHRoID0gdGhpcy5wb3J0cmFpdCA/IDQwMCA6IDYwMDtcbiAgICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZSgne3dpZHRofXh7aGVpZ2h0fScpKHt3aWR0aDogc2NhbGVkV2lkdGgsIGhlaWdodDogaW50ZW5kZWRIZWlnaHR9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbmV4dFRhYjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy4kLnBsYWluVGFicy5zZWxlY3ROZXh0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3ByZXZpb3VzVGFiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLiQucGxhaW5UYWJzLnNlbGVjdFByZXZpb3VzKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3N0cmluZ2lmeTogZnVuY3Rpb24oaW1hZ2VJdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGltYWdlSXRlbSwgbnVsbCwgJyAnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
