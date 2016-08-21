'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-image-list-article-grouped',
    properties: {
      config: {
        type: Object
      },
      item: {
        type: String,
        value: '(not set)'
      },
      articles: {
        type: Array
      },
      title: {
        type: String,
        value: 'Results'
      },
      showResultCount: {
        type: Boolean,
        value: false,
        notify: true
      },
      seltd: {
        type: Object,
        value: function value() {
          return [];
        },
        //readOnly: true,
        reflectToAttribute: true
      },
      canShowCopy: {
        type: Boolean,
        value: false,
        notify: true
      },
      canSendToInitiator: {
        type: Boolean,
        value: false,
        notify: true
      },
      hasSelection: {
        type: Boolean,
        value: false,
        notify: true
      },
      showSelection: {
        type: Boolean,
        value: false,
        notify: true
      }
    },

    observers: ['selectedChanged(selected.*)', 'selectedChanged(seltd.*)'],

    getMediaItemReferenceAt: function getMediaItemReferenceAt(mediaItem, idx) {
      var reference = mediaItem.references[idx];
      return {
        caption: mediaItem.caption,
        altText: reference.alternateText,
        imageURL: reference.imageURL,
        width: reference.width,
        height: reference.height,
        mimeType: reference.mimeType,
        source: reference.imageSource,
        selected: false
      };
    },

    toggleItem: function toggleItem(e) {

      var image = e.model.image;
      console.log('toggle image: ', image);

      image.selected = !image.selected;

      if (image.selected) {
        this._addItem(image);
      } else {
        this._removeItem(image);
      }

      e.model.set('image.selected', e.model.image.selected);

      var tmp = this.setld;
      this.setld = [];
      this.setld = tmp;
      this.selected = tmp;
      this.notifyPath('setld', this.setld);
      this.notifyPath('selected', this.setld);
      Polymer.dom.flush();
    },
    _removeItem: function _removeItem(toRemove) {
      var index = this.seltd.indexOf(toRemove);
      this.splice('seltd', index, 1);
    },
    _addItem: function _addItem(toAdd) {
      this.push('seltd', toAdd);
    },
    hasSelection: function hasSelection() {
      var hasSelection = this.seltd.length > 0;
      console.log('hasSelection: "', hasSelection);
      return hasSelection;
    },

    /**
     * This will return the selected items back to the parent window.
    */
    sendToInitiator: function sendToInitiator() {
      if (window.opener) {
        var message = JSON.stringify({
          request: 'selected',
          items: this.selected
        });
        if (message) {
          console.info('sending selected: %s', message);
          window.opener.postMessage(message, '*');
        } else {
          console.warn('no value to send.');
        }
      } else {
        console.error('Can not send message. Window has no opener.');
      }
    },
    _itemAsString: function _itemAsString(item) {
      return JSON.stringify(item, null, '   ');
    },
    heading: function heading(metaData) {
      if (metaData.abstractSummary) {
        return metaData.abstractSummary;
      } else {
        return 'No Heading';
      }
    },
    dateFromLong: function dateFromLong(longDate) {
      return new Date(longDate).toDateString();
    },
    byLine: function byLine(author) {
      return author ? 'by ' + author : '';
    },
    itemsForSelection: function itemsForSelection(_itemsForSelection) {
      var r = this;
      _itemsForSelection.forEach(function (item) {
        console.log('itemForSelection: ', r.getMediaItemReferenceAt(item.mediaItems[0], 0));
      });
    },
    selectedChanged: function selectedChanged(ch) {
      console.log('ch: ', ch);
      if (ch.path === 'seltd.length') {
        this.hasSelection = ch.value > 0;
        var data = ch.base;
        this.fire('iron-signal', { name: 'selection-changed', data: data });
      }
    },
    toggleShowSelection: function toggleShowSelection() {
      console.log('toggleShowSelection');
      this.showSelection = !this.showSelection;
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1pbWFnZS1saXN0L2FjYS1pbWFnZS1saXN0LWFydGljbGUtZ3JvdXBlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNOOztBQUVBLFVBQVE7QUFDTixRQUFJLGdDQURFO0FBRU4sZ0JBQVk7QUFDVixjQUFRO0FBQ04sY0FBTTtBQURBLE9BREU7QUFJVixZQUFNO0FBQ0osY0FBTSxNQURGO0FBRUosZUFBTztBQUZILE9BSkk7QUFRVixnQkFBVTtBQUNSLGNBQU07QUFERSxPQVJBO0FBV1YsYUFBTztBQUNMLGNBQU0sTUFERDtBQUVMLGVBQU87QUFGRixPQVhHO0FBZVYsdUJBQWlCO0FBQ2YsY0FBTSxPQURTO0FBRWYsZUFBTyxLQUZRO0FBR2YsZ0JBQVE7QUFITyxPQWZQO0FBb0JWLGFBQU87QUFDTCxjQUFNLE1BREQ7QUFFTCxlQUFPLGlCQUFXO0FBQUMsaUJBQU8sRUFBUDtBQUFXLFNBRnpCO0FBR0w7QUFDQSw0QkFBb0I7QUFKZixPQXBCRztBQTJCVixtQkFBYTtBQUNYLGNBQU0sT0FESztBQUVYLGVBQU8sS0FGSTtBQUdYLGdCQUFRO0FBSEcsT0EzQkg7QUFnQ1YsMEJBQW9CO0FBQ2xCLGNBQU0sT0FEWTtBQUVsQixlQUFPLEtBRlc7QUFHbEIsZ0JBQVE7QUFIVSxPQWhDVjtBQXFDVixvQkFBYztBQUNaLGNBQU0sT0FETTtBQUVaLGVBQU8sS0FGSztBQUdaLGdCQUFRO0FBSEksT0FyQ0o7QUEwQ1YscUJBQWU7QUFDYixjQUFNLE9BRE87QUFFYixlQUFPLEtBRk07QUFHYixnQkFBUTtBQUhLO0FBMUNMLEtBRk47O0FBbUROLGVBQVcsQ0FDVCw2QkFEUyxFQUNzQiwwQkFEdEIsQ0FuREw7O0FBdUROLDZCQUF5QixpQ0FBUyxTQUFULEVBQW9CLEdBQXBCLEVBQXlCO0FBQ2hELFVBQUksWUFBWSxVQUFVLFVBQVYsQ0FBcUIsR0FBckIsQ0FBaEI7QUFDQSxhQUFPO0FBQ0wsaUJBQVMsVUFBVSxP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QW1CLDJCQUFTLGtCQUFULEVBQTRCO0FBQzdDLFVBQUksSUFBSSxJQUFSO0FBQ0EseUJBQWtCLE9BQWxCLENBQTBCLFVBQVMsSUFBVCxFQUFlO0FBQ3ZDLGdCQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxFQUFFLHVCQUFGLENBQTBCLEtBQUssVUFBTCxDQUFnQixDQUFoQixDQUExQixFQUE4QyxDQUE5QyxDQUFsQztBQUNELE9BRkQ7QUFHRCxLQWpKSztBQWtKTixxQkFBaUIseUJBQVMsRUFBVCxFQUFhO0FBQzVCLGNBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsRUFBcEI7QUFDQSxVQUFJLEdBQUcsSUFBSCxLQUFZLGNBQWhCLEVBQWdDO0FBQzlCLGFBQUssWUFBTCxHQUFvQixHQUFHLEtBQUgsR0FBVyxDQUEvQjtBQUNBLFlBQUksT0FBTyxHQUFHLElBQWQ7QUFDQSxhQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCLEVBQUMsTUFBTSxtQkFBUCxFQUE0QixNQUFNLElBQWxDLEVBQXpCO0FBQ0Q7QUFDRixLQXpKSztBQTBKTix5QkFBcUIsK0JBQVc7QUFDOUIsY0FBUSxHQUFSLENBQVkscUJBQVo7QUFDQSxXQUFLLGFBQUwsR0FBcUIsQ0FBQyxLQUFLLGFBQTNCO0FBQ0Q7QUE3SkssR0FBUjtBQStKRCxDQWxLTCIsImZpbGUiOiJlbGVtZW50cy9hY2EtaW1hZ2UtbGlzdC9hY2EtaW1hZ2UtbGlzdC1hcnRpY2xlLWdyb3VwZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgIFBvbHltZXIoe1xuICAgICAgICBpczogJ2FjYS1pbWFnZS1saXN0LWFydGljbGUtZ3JvdXBlZCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICcobm90IHNldCknXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhcnRpY2xlczoge1xuICAgICAgICAgICAgdHlwZTogQXJyYXlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJ1Jlc3VsdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93UmVzdWx0Q291bnQ6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlbHRkOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7cmV0dXJuIFtdO30sXG4gICAgICAgICAgICAvL3JlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgICAgcmVmbGVjdFRvQXR0cmlidXRlOiB0cnVlLFxuICAgICAgICAgICAgLy9ub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhblNob3dDb3B5OiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5OiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYW5TZW5kVG9Jbml0aWF0b3I6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICBub3RpZnk6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhhc1NlbGVjdGlvbjoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd1NlbGVjdGlvbjoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBvYnNlcnZlcnM6IFtcbiAgICAgICAgICAnc2VsZWN0ZWRDaGFuZ2VkKHNlbGVjdGVkLiopJywgJ3NlbGVjdGVkQ2hhbmdlZChzZWx0ZC4qKSdcbiAgICAgICAgXSxcblxuICAgICAgICBnZXRNZWRpYUl0ZW1SZWZlcmVuY2VBdDogZnVuY3Rpb24obWVkaWFJdGVtLCBpZHgpIHtcbiAgICAgICAgICB2YXIgcmVmZXJlbmNlID0gbWVkaWFJdGVtLnJlZmVyZW5jZXNbaWR4XTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2FwdGlvbjogbWVkaWFJdGVtLmNhcHRpb24sXG4gICAgICAgICAgICBhbHRUZXh0OiByZWZlcmVuY2UuYWx0ZXJuYXRlVGV4dCxcbiAgICAgICAgICAgIGltYWdlVVJMOiByZWZlcmVuY2UuaW1hZ2VVUkwsXG4gICAgICAgICAgICB3aWR0aDogcmVmZXJlbmNlLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByZWZlcmVuY2UuaGVpZ2h0LFxuICAgICAgICAgICAgbWltZVR5cGU6IHJlZmVyZW5jZS5taW1lVHlwZSxcbiAgICAgICAgICAgIHNvdXJjZTogcmVmZXJlbmNlLmltYWdlU291cmNlLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlXG4gICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b2dnbGVJdGVtOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICB2YXIgaW1hZ2UgPSBlLm1vZGVsLmltYWdlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2dnbGUgaW1hZ2U6ICcsIGltYWdlKTtcblxuICAgICAgICAgIGltYWdlLnNlbGVjdGVkID0gIWltYWdlLnNlbGVjdGVkO1xuXG4gICAgICAgICAgaWYgKGltYWdlLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRJdGVtKGltYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlSXRlbShpbWFnZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZS5tb2RlbC5zZXQoJ2ltYWdlLnNlbGVjdGVkJywgZS5tb2RlbC5pbWFnZS5zZWxlY3RlZCk7XG5cbiAgICAgICAgICB2YXIgdG1wID0gdGhpcy5zZXRsZDtcbiAgICAgICAgICB0aGlzLnNldGxkID0gW107XG4gICAgICAgICAgdGhpcy5zZXRsZCA9IHRtcDtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdG1wO1xuICAgICAgICAgIHRoaXMubm90aWZ5UGF0aCgnc2V0bGQnLCB0aGlzLnNldGxkKTtcbiAgICAgICAgICB0aGlzLm5vdGlmeVBhdGgoJ3NlbGVjdGVkJywgdGhpcy5zZXRsZCk7XG4gICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3JlbW92ZUl0ZW06IGZ1bmN0aW9uKHRvUmVtb3ZlKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zZWx0ZC5pbmRleE9mKHRvUmVtb3ZlKTtcbiAgICAgICAgICB0aGlzLnNwbGljZSgnc2VsdGQnLCBpbmRleCwgMSk7XG4gICAgICAgIH0sXG4gICAgICAgIF9hZGRJdGVtOiBmdW5jdGlvbih0b0FkZCkge1xuICAgICAgICAgIHRoaXMucHVzaCgnc2VsdGQnLCB0b0FkZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc1NlbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGhhc1NlbGVjdGlvbiA9IHRoaXMuc2VsdGQubGVuZ3RoID4gMDtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGFzU2VsZWN0aW9uOiBcIicsIGhhc1NlbGVjdGlvbik7XG4gICAgICAgICAgcmV0dXJuIGhhc1NlbGVjdGlvbjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyB3aWxsIHJldHVybiB0aGUgc2VsZWN0ZWQgaXRlbXMgYmFjayB0byB0aGUgcGFyZW50IHdpbmRvdy5cbiAgICAgICAgKi9cbiAgICAgICAgc2VuZFRvSW5pdGlhdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHJlcXVlc3Q6ICdzZWxlY3RlZCcsXG4gICAgICAgICAgICAgIGl0ZW1zOiB0aGlzLnNlbGVjdGVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnc2VuZGluZyBzZWxlY3RlZDogJXMnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgd2luZG93Lm9wZW5lci5wb3N0TWVzc2FnZShtZXNzYWdlLCAnKicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdubyB2YWx1ZSB0byBzZW5kLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDYW4gbm90IHNlbmQgbWVzc2FnZS4gV2luZG93IGhhcyBubyBvcGVuZXIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfaXRlbUFzU3RyaW5nOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGl0ZW0sIG51bGwsICcgICAnKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGVhZGluZzogZnVuY3Rpb24obWV0YURhdGEpIHtcbiAgICAgICAgICBpZiAobWV0YURhdGEuYWJzdHJhY3RTdW1tYXJ5KSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0YURhdGEuYWJzdHJhY3RTdW1tYXJ5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ05vIEhlYWRpbmcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGF0ZUZyb21Mb25nOiBmdW5jdGlvbihsb25nRGF0ZSkge1xuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShsb25nRGF0ZSkudG9EYXRlU3RyaW5nKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGJ5TGluZTogZnVuY3Rpb24oYXV0aG9yKSB7XG4gICAgICAgICAgcmV0dXJuIGF1dGhvciA/ICdieSAnICsgYXV0aG9yIDogJyc7XG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW1zRm9yU2VsZWN0aW9uOiBmdW5jdGlvbihpdGVtc0ZvclNlbGVjdGlvbikge1xuICAgICAgICAgIHZhciByID0gdGhpcztcbiAgICAgICAgICBpdGVtc0ZvclNlbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdGVtRm9yU2VsZWN0aW9uOiAnLCByLmdldE1lZGlhSXRlbVJlZmVyZW5jZUF0KGl0ZW0ubWVkaWFJdGVtc1swXSwgMCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZENoYW5nZWQ6IGZ1bmN0aW9uKGNoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NoOiAnLCBjaCk7XG4gICAgICAgICAgaWYgKGNoLnBhdGggPT09ICdzZWx0ZC5sZW5ndGgnKSB7XG4gICAgICAgICAgICB0aGlzLmhhc1NlbGVjdGlvbiA9IGNoLnZhbHVlID4gMDtcbiAgICAgICAgICAgIHZhciBkYXRhID0gY2guYmFzZTtcbiAgICAgICAgICAgIHRoaXMuZmlyZSgnaXJvbi1zaWduYWwnLCB7bmFtZTogJ3NlbGVjdGlvbi1jaGFuZ2VkJywgZGF0YTogZGF0YX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlU2hvd1NlbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZVNob3dTZWxlY3Rpb24nKTtcbiAgICAgICAgICB0aGlzLnNob3dTZWxlY3Rpb24gPSAhdGhpcy5zaG93U2VsZWN0aW9uO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
