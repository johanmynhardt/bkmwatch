'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-meta-dialog-overview-data',

    properties: {
      item: {
        type: Object,
        value: undefined
      },
      bounds: {
        type: String,
        value: ''
      },
      _copyrightHidden: {
        type: Boolean,
        value: true
      }
    },

    observers: ['portraitChanged(portrait)'],

    portraitChanged: function portraitChanged(isPortrait) {
      //console.log('portraitChanged: ', isPortrait);
      this.portrait = isPortrait;
      this.bounds = isPortrait ? this._boundStyle(200, 600) : this._boundStyle(600, 200);
    },

    _boundStyle: function _boundStyle(val1, val2) {
      return _.template('width:{w}px; height:{h}px;')({ w: val1, h: val2 });
    },

    _getProp: function _getProp(list, idx, prop) {
      return list[idx][prop];
    },

    containsAndNot: _.curry(function (toMatch, toExclude, key) {
      /**
       * A key is an exclusion key if the key contains the exclusion key
       **/
      var isExclusionKey = function isExclusionKey(currentKey) {
        return function (exclusionKey) {
          return _.includes(currentKey, exclusionKey);
        };
      };

      var currentKey = _.first(_.map(_.isString(key) ? [key] : key, _.toLower));
      var toMatchArr = _.isString(toMatch) ? [toMatch] : toMatch;

      return _.some(toMatchArr, function (toMatch) {
        return _.includes(currentKey, toMatch) && !_.some(toExclude, isExclusionKey(currentKey));
      });
    }),

    _metaDataReceived: function _metaDataReceived(metaDataEvent) {
      var metaData = metaDataEvent.detail;

      var includeKeys = ['copy', 'by-line', 'credit', 'artist', 'creator'];
      var excludeKeys = ['profile', 'flag', 'tool'];

      /**
       *  The basic structure for our operations (filter/map):
       *      {profile: {profileKey: value, ...}}
       */
      var toProfileTuple = function toProfileTuple(values, profile) {
        var data = {};
        data[profile] = values;
        return data;
      };

      var profileKeyFromTuple = function profileKeyFromTuple(profileTuple) {
        return _.first(_.keys(profileTuple));
      };

      var profileFromTuple = function profileFromTuple(profileTuple) {
        return profileTuple[profileKeyFromTuple(profileTuple)];
      };

      var validKeysFromTuple = function (profileTuple) {
        return _.chain(_.keys(profileFromTuple(profileTuple))).filter(this.containsAndNot(includeKeys, excludeKeys));
      }.bind(this);

      var profileContainsValidKeys = function profileContainsValidKeys(profileTuple) {
        var profileKey = profileKeyFromTuple(profileTuple);
        console.debug('filtering profile: ', profileKey);
        return !validKeysFromTuple(profileTuple).isEmpty().value();
      };

      // curry so we can pass metadata and return a function to operate on keys.
      var hydrateKeysFromMetaData = function hydrateKeysFromMetaData(metaData) {
        return function (profileKeys) {
          var profile = profileKeyFromTuple(profileKeys);
          return _.chain(profileKeys[profile]).map(function (key) {
            return metaData[profile][key];
          }).value();
        };
      };

      var hydrateValidKeys = function hydrateValidKeys(profileTuple) {
        var keys = validKeysFromTuple(profileTuple).value();
        return toProfileTuple(keys, profileKeyFromTuple(profileTuple));
      };

      var copyrightValues = _.chain(metaData).map(toProfileTuple).filter(profileContainsValidKeys).map(hydrateValidKeys).map(hydrateKeysFromMetaData(metaData)).flatten().uniq().value();

      if (_.isEmpty(copyrightValues)) {
        this.copyrightInfo = '';
        this._copyrightHidden = true;
      } else {
        this.copyrightInfo = _.uniq(copyrightValues).reduce(function (k, v) {
          return k + ', ' + v;
        });
        this._copyrightHidden = false;
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1tZXRhLWRpYWxvZy9hY2EtbWV0YS1kaWFsb2ctb3ZlcnZpZXctZGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNOOztBQUVBLFVBQVE7QUFDTixRQUFJLCtCQURFOztBQUdOLGdCQUFZO0FBQ1YsWUFBTTtBQUNKLGNBQU0sTUFERjtBQUVKLGVBQU87QUFGSCxPQURJO0FBS1YsY0FBUTtBQUNOLGNBQU0sTUFEQTtBQUVOLGVBQU87QUFGRCxPQUxFO0FBU1Ysd0JBQWtCO0FBQ2hCLGNBQU0sT0FEVTtBQUVoQixlQUFPO0FBRlM7QUFUUixLQUhOOztBQWtCTixlQUFXLENBQUMsMkJBQUQsQ0FsQkw7O0FBb0JOLHFCQUFpQix5QkFBUyxVQUFULEVBQXFCO0FBQ3BDO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLFVBQWhCO0FBQ0EsV0FBSyxNQUFMLEdBQWMsYUFBYSxLQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsQ0FBYixHQUEwQyxLQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsQ0FBeEQ7QUFDRCxLQXhCSzs7QUEwQk4saUJBQWEscUJBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7QUFDaEMsYUFBTyxFQUFFLFFBQUYsQ0FBVyw0QkFBWCxFQUF5QyxFQUFDLEdBQUcsSUFBSixFQUFVLEdBQUcsSUFBYixFQUF6QyxDQUFQO0FBQ0QsS0E1Qks7O0FBOEJOLGNBQVUsa0JBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0IsSUFBcEIsRUFBMEI7QUFDbEMsYUFBTyxLQUFLLEdBQUwsRUFBVSxJQUFWLENBQVA7QUFDRCxLQWhDSzs7QUFrQ04sb0JBQWdCLEVBQUUsS0FBRixDQUFRLFVBQVMsT0FBVCxFQUFrQixTQUFsQixFQUE2QixHQUE3QixFQUFrQztBQUN4RDs7O0FBR0EsVUFBTSxpQkFBaUIsU0FBakIsY0FBaUI7QUFBQSxlQUFjO0FBQUEsaUJBQWdCLEVBQUUsUUFBRixDQUFXLFVBQVgsRUFBdUIsWUFBdkIsQ0FBaEI7QUFBQSxTQUFkO0FBQUEsT0FBdkI7O0FBRUEsVUFBSSxhQUFhLEVBQUUsS0FBRixDQUFRLEVBQUUsR0FBRixDQUFPLEVBQUUsUUFBRixDQUFXLEdBQVgsSUFBa0IsQ0FBQyxHQUFELENBQWxCLEdBQTBCLEdBQWpDLEVBQXVDLEVBQUUsT0FBekMsQ0FBUixDQUFqQjtBQUNBLFVBQUksYUFBYSxFQUFFLFFBQUYsQ0FBVyxPQUFYLElBQXNCLENBQUMsT0FBRCxDQUF0QixHQUFrQyxPQUFuRDs7QUFFQSxhQUFPLEVBQUUsSUFBRixDQUFPLFVBQVAsRUFBbUIsVUFBQyxPQUFEO0FBQUEsZUFBYyxFQUFFLFFBQUYsQ0FBVyxVQUFYLEVBQXVCLE9BQXZCLEtBQW1DLENBQUMsRUFBRSxJQUFGLENBQU8sU0FBUCxFQUFrQixlQUFlLFVBQWYsQ0FBbEIsQ0FBbEQ7QUFBQSxPQUFuQixDQUFQO0FBQ0QsS0FWZSxDQWxDVjs7QUE4Q04sdUJBQW1CLDJCQUFTLGFBQVQsRUFBd0I7QUFDekMsVUFBSSxXQUFXLGNBQWMsTUFBN0I7O0FBRUEsVUFBTSxjQUFjLENBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsUUFBcEIsRUFBOEIsUUFBOUIsRUFBd0MsU0FBeEMsQ0FBcEI7QUFDQSxVQUFNLGNBQWMsQ0FBQyxTQUFELEVBQVksTUFBWixFQUFvQixNQUFwQixDQUFwQjs7QUFFQTs7OztBQUlBLFVBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBcUI7QUFDMUMsWUFBSSxPQUFPLEVBQVg7QUFDQSxhQUFLLE9BQUwsSUFBZ0IsTUFBaEI7QUFDQSxlQUFPLElBQVA7QUFDRCxPQUpEOztBQU1BLFVBQU0sc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFDLFlBQUQ7QUFBQSxlQUFrQixFQUFFLEtBQUYsQ0FBUSxFQUFFLElBQUYsQ0FBTyxZQUFQLENBQVIsQ0FBbEI7QUFBQSxPQUE1Qjs7QUFFQSxVQUFNLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBQyxZQUFEO0FBQUEsZUFBbUIsYUFBYSxvQkFBb0IsWUFBcEIsQ0FBYixDQUFuQjtBQUFBLE9BQXpCOztBQUVBLFVBQU0scUJBQXFCLFVBQVMsWUFBVCxFQUF1QjtBQUNoRCxlQUFPLEVBQUUsS0FBRixDQUFRLEVBQUUsSUFBRixDQUFPLGlCQUFpQixZQUFqQixDQUFQLENBQVIsRUFDRixNQURFLENBQ0ssS0FBSyxjQUFMLENBQW9CLFdBQXBCLEVBQWlDLFdBQWpDLENBREwsQ0FBUDtBQUVELE9BSDBCLENBR3pCLElBSHlCLENBR3BCLElBSG9CLENBQTNCOztBQUtBLFVBQU0sMkJBQTJCLFNBQTNCLHdCQUEyQixDQUFDLFlBQUQsRUFBa0I7QUFDakQsWUFBSSxhQUFhLG9CQUFvQixZQUFwQixDQUFqQjtBQUNBLGdCQUFRLEtBQVIsQ0FBYyxxQkFBZCxFQUFxQyxVQUFyQztBQUNBLGVBQU8sQ0FBQyxtQkFBbUIsWUFBbkIsRUFBaUMsT0FBakMsR0FBMkMsS0FBM0MsRUFBUjtBQUNELE9BSkQ7O0FBTUE7QUFDQSxVQUFNLDBCQUEwQixTQUExQix1QkFBMEI7QUFBQSxlQUFZLHVCQUFlO0FBQ3pELGNBQUksVUFBVSxvQkFBb0IsV0FBcEIsQ0FBZDtBQUNBLGlCQUFPLEVBQUUsS0FBRixDQUFRLFlBQVksT0FBWixDQUFSLEVBQThCLEdBQTlCLENBQWtDO0FBQUEsbUJBQU8sU0FBUyxPQUFULEVBQWtCLEdBQWxCLENBQVA7QUFBQSxXQUFsQyxFQUFpRSxLQUFqRSxFQUFQO0FBQ0QsU0FIK0I7QUFBQSxPQUFoQzs7QUFLQSxVQUFNLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBQyxZQUFELEVBQWtCO0FBQ3pDLFlBQUksT0FBTyxtQkFBbUIsWUFBbkIsRUFBaUMsS0FBakMsRUFBWDtBQUNBLGVBQU8sZUFBZSxJQUFmLEVBQXFCLG9CQUFvQixZQUFwQixDQUFyQixDQUFQO0FBQ0QsT0FIRDs7QUFLQSxVQUFJLGtCQUFrQixFQUFFLEtBQUYsQ0FBUSxRQUFSLEVBQ2pCLEdBRGlCLENBQ2IsY0FEYSxFQUVqQixNQUZpQixDQUVWLHdCQUZVLEVBR2pCLEdBSGlCLENBR2IsZ0JBSGEsRUFJakIsR0FKaUIsQ0FJYix3QkFBd0IsUUFBeEIsQ0FKYSxFQUtqQixPQUxpQixHQU1qQixJQU5pQixHQU9qQixLQVBpQixFQUF0Qjs7QUFTQSxVQUFJLEVBQUUsT0FBRixDQUFVLGVBQVYsQ0FBSixFQUFnQztBQUM5QixhQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxhQUFLLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxhQUFMLEdBQXFCLEVBQUUsSUFBRixDQUFPLGVBQVAsRUFBd0IsTUFBeEIsQ0FBK0IsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLGlCQUFVLElBQUksSUFBSixHQUFXLENBQXJCO0FBQUEsU0FBL0IsQ0FBckI7QUFDQSxhQUFLLGdCQUFMLEdBQXdCLEtBQXhCO0FBQ0Q7QUFDRjtBQXhHSyxHQUFSO0FBMEdELENBN0dMIiwiZmlsZSI6ImVsZW1lbnRzL2FjYS1tZXRhLWRpYWxvZy9hY2EtbWV0YS1kaWFsb2ctb3ZlcnZpZXctZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgUG9seW1lcih7XG4gICAgICAgIGlzOiAnYWNhLW1ldGEtZGlhbG9nLW92ZXJ2aWV3LWRhdGEnLFxuXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkXG4gICAgICAgICAgfSxcbiAgICAgICAgICBib3VuZHM6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgX2NvcHlyaWdodEhpZGRlbjoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG9ic2VydmVyczogWydwb3J0cmFpdENoYW5nZWQocG9ydHJhaXQpJ10sXG5cbiAgICAgICAgcG9ydHJhaXRDaGFuZ2VkOiBmdW5jdGlvbihpc1BvcnRyYWl0KSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygncG9ydHJhaXRDaGFuZ2VkOiAnLCBpc1BvcnRyYWl0KTtcbiAgICAgICAgICB0aGlzLnBvcnRyYWl0ID0gaXNQb3J0cmFpdDtcbiAgICAgICAgICB0aGlzLmJvdW5kcyA9IGlzUG9ydHJhaXQgPyB0aGlzLl9ib3VuZFN0eWxlKDIwMCwgNjAwKSA6IHRoaXMuX2JvdW5kU3R5bGUoNjAwLCAyMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9ib3VuZFN0eWxlOiBmdW5jdGlvbih2YWwxLCB2YWwyKSB7XG4gICAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUoJ3dpZHRoOnt3fXB4OyBoZWlnaHQ6e2h9cHg7Jykoe3c6IHZhbDEsIGg6IHZhbDJ9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZ2V0UHJvcDogZnVuY3Rpb24obGlzdCwgaWR4LCBwcm9wKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RbaWR4XVtwcm9wXTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb250YWluc0FuZE5vdDogXy5jdXJyeShmdW5jdGlvbih0b01hdGNoLCB0b0V4Y2x1ZGUsIGtleSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEEga2V5IGlzIGFuIGV4Y2x1c2lvbiBrZXkgaWYgdGhlIGtleSBjb250YWlucyB0aGUgZXhjbHVzaW9uIGtleVxuICAgICAgICAgICAqKi9cbiAgICAgICAgICBjb25zdCBpc0V4Y2x1c2lvbktleSA9IGN1cnJlbnRLZXkgPT4gZXhjbHVzaW9uS2V5ID0+IF8uaW5jbHVkZXMoY3VycmVudEtleSwgZXhjbHVzaW9uS2V5KTtcblxuICAgICAgICAgIGxldCBjdXJyZW50S2V5ID0gXy5maXJzdChfLm1hcCgoXy5pc1N0cmluZyhrZXkpID8gW2tleV0gOiBrZXkpLCBfLnRvTG93ZXIpKTtcbiAgICAgICAgICBsZXQgdG9NYXRjaEFyciA9IF8uaXNTdHJpbmcodG9NYXRjaCkgPyBbdG9NYXRjaF0gOiB0b01hdGNoO1xuXG4gICAgICAgICAgcmV0dXJuIF8uc29tZSh0b01hdGNoQXJyLCAodG9NYXRjaCkgPT4gIF8uaW5jbHVkZXMoY3VycmVudEtleSwgdG9NYXRjaCkgJiYgIV8uc29tZSh0b0V4Y2x1ZGUsIGlzRXhjbHVzaW9uS2V5KGN1cnJlbnRLZXkpKSk7XG4gICAgICAgIH0pLFxuXG4gICAgICAgIF9tZXRhRGF0YVJlY2VpdmVkOiBmdW5jdGlvbihtZXRhRGF0YUV2ZW50KSB7XG4gICAgICAgICAgbGV0IG1ldGFEYXRhID0gbWV0YURhdGFFdmVudC5kZXRhaWw7XG5cbiAgICAgICAgICBjb25zdCBpbmNsdWRlS2V5cyA9IFsnY29weScsICdieS1saW5lJywgJ2NyZWRpdCcsICdhcnRpc3QnLCAnY3JlYXRvciddO1xuICAgICAgICAgIGNvbnN0IGV4Y2x1ZGVLZXlzID0gWydwcm9maWxlJywgJ2ZsYWcnLCAndG9vbCddO1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogIFRoZSBiYXNpYyBzdHJ1Y3R1cmUgZm9yIG91ciBvcGVyYXRpb25zIChmaWx0ZXIvbWFwKTpcbiAgICAgICAgICAgKiAgICAgIHtwcm9maWxlOiB7cHJvZmlsZUtleTogdmFsdWUsIC4uLn19XG4gICAgICAgICAgICovXG4gICAgICAgICAgY29uc3QgdG9Qcm9maWxlVHVwbGUgPSAodmFsdWVzLCBwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YVtwcm9maWxlXSA9IHZhbHVlcztcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBwcm9maWxlS2V5RnJvbVR1cGxlID0gKHByb2ZpbGVUdXBsZSkgPT4gXy5maXJzdChfLmtleXMocHJvZmlsZVR1cGxlKSk7XG5cbiAgICAgICAgICBjb25zdCBwcm9maWxlRnJvbVR1cGxlID0gKHByb2ZpbGVUdXBsZSkgPT4gIHByb2ZpbGVUdXBsZVtwcm9maWxlS2V5RnJvbVR1cGxlKHByb2ZpbGVUdXBsZSldO1xuXG4gICAgICAgICAgY29uc3QgdmFsaWRLZXlzRnJvbVR1cGxlID0gZnVuY3Rpb24ocHJvZmlsZVR1cGxlKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5jaGFpbihfLmtleXMocHJvZmlsZUZyb21UdXBsZShwcm9maWxlVHVwbGUpKSlcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHRoaXMuY29udGFpbnNBbmROb3QoaW5jbHVkZUtleXMsIGV4Y2x1ZGVLZXlzKSk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgY29uc3QgcHJvZmlsZUNvbnRhaW5zVmFsaWRLZXlzID0gKHByb2ZpbGVUdXBsZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHByb2ZpbGVLZXkgPSBwcm9maWxlS2V5RnJvbVR1cGxlKHByb2ZpbGVUdXBsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdmaWx0ZXJpbmcgcHJvZmlsZTogJywgcHJvZmlsZUtleSk7XG4gICAgICAgICAgICByZXR1cm4gIXZhbGlkS2V5c0Zyb21UdXBsZShwcm9maWxlVHVwbGUpLmlzRW1wdHkoKS52YWx1ZSgpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBjdXJyeSBzbyB3ZSBjYW4gcGFzcyBtZXRhZGF0YSBhbmQgcmV0dXJuIGEgZnVuY3Rpb24gdG8gb3BlcmF0ZSBvbiBrZXlzLlxuICAgICAgICAgIGNvbnN0IGh5ZHJhdGVLZXlzRnJvbU1ldGFEYXRhID0gbWV0YURhdGEgPT4gcHJvZmlsZUtleXMgPT4ge1xuICAgICAgICAgICAgbGV0IHByb2ZpbGUgPSBwcm9maWxlS2V5RnJvbVR1cGxlKHByb2ZpbGVLZXlzKTtcbiAgICAgICAgICAgIHJldHVybiBfLmNoYWluKHByb2ZpbGVLZXlzW3Byb2ZpbGVdKS5tYXAoa2V5ID0+IG1ldGFEYXRhW3Byb2ZpbGVdW2tleV0pLnZhbHVlKCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IGh5ZHJhdGVWYWxpZEtleXMgPSAocHJvZmlsZVR1cGxlKSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5cyA9IHZhbGlkS2V5c0Zyb21UdXBsZShwcm9maWxlVHVwbGUpLnZhbHVlKCk7XG4gICAgICAgICAgICByZXR1cm4gdG9Qcm9maWxlVHVwbGUoa2V5cywgcHJvZmlsZUtleUZyb21UdXBsZShwcm9maWxlVHVwbGUpKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgbGV0IGNvcHlyaWdodFZhbHVlcyA9IF8uY2hhaW4obWV0YURhdGEpXG4gICAgICAgICAgICAgIC5tYXAodG9Qcm9maWxlVHVwbGUpXG4gICAgICAgICAgICAgIC5maWx0ZXIocHJvZmlsZUNvbnRhaW5zVmFsaWRLZXlzKVxuICAgICAgICAgICAgICAubWFwKGh5ZHJhdGVWYWxpZEtleXMpXG4gICAgICAgICAgICAgIC5tYXAoaHlkcmF0ZUtleXNGcm9tTWV0YURhdGEobWV0YURhdGEpKVxuICAgICAgICAgICAgICAuZmxhdHRlbigpXG4gICAgICAgICAgICAgIC51bmlxKClcbiAgICAgICAgICAgICAgLnZhbHVlKCk7XG5cbiAgICAgICAgICBpZiAoXy5pc0VtcHR5KGNvcHlyaWdodFZhbHVlcykpIHtcbiAgICAgICAgICAgIHRoaXMuY29weXJpZ2h0SW5mbyA9ICcnO1xuICAgICAgICAgICAgdGhpcy5fY29weXJpZ2h0SGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb3B5cmlnaHRJbmZvID0gXy51bmlxKGNvcHlyaWdodFZhbHVlcykucmVkdWNlKChrLCB2KSA9PiBrICsgJywgJyArIHYpO1xuICAgICAgICAgICAgdGhpcy5fY29weXJpZ2h0SGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
