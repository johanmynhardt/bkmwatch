'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-config',

    properties: {
      searchBase: {
        type: String,
        value: 'https://az-baobab-support.afrozaar.com'
      },
      contentBase: {
        type: String,
        value: 'https://az-baobab.afrozaar.com'
      },
      tk: {
        type: String,
        value: 'az'
      },
      appId: {
        type: Number,
        value: 8
      },
      apiL: {
        type: Number,
        value: 9
      },
      irsBase: {
        type: String,
        value: 'https://test-irs.afrozaar.com/image'
      },
      standalone: {
        type: Boolean,
        value: true
      },
      limitToType: {
        type: String,
        value: undefined
      }
    },

    _alertLink: function _alertLink() {
      console.log('//TODO: alertLink');
    },

    _go: function _go() {

      var seedConfig = {}; // all this keys

      _.keys(this.properties).forEach(function (key) {
        seedConfig[key] = this[key];
      }.bind(this));

      console.info('saving from _go, seedConfig: ', seedConfig);

      app.saveConfig(seedConfig);

      page.redirect('/search');
    },

    /**
     *  This will be called in standalone mode and only when the required keys are all present.
     */
    _configUpdated: function _configUpdated(e) {
      console.log('_configUpdated: ', e);
      var transferKeyTo = function transferKeyTo(to) {
        return function (key) {
          return to[key] = e.detail[key];
        };
      };

      _.keys(e.detail).forEach(transferKeyTo(this));
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1jb25maWcvYWNhLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNOOztBQUVBLFVBQVE7QUFDTixRQUFJLFlBREU7O0FBR04sZ0JBQVk7QUFDVixrQkFBWTtBQUNWLGNBQU0sTUFESTtBQUVWLGVBQU87QUFGRyxPQURGO0FBS1YsbUJBQWE7QUFDWCxjQUFNLE1BREs7QUFFWCxlQUFPO0FBRkksT0FMSDtBQVNWLFVBQUk7QUFDRixjQUFNLE1BREo7QUFFRixlQUFPO0FBRkwsT0FUTTtBQWFWLGFBQU87QUFDTCxjQUFNLE1BREQ7QUFFTCxlQUFPO0FBRkYsT0FiRztBQWlCVixZQUFNO0FBQ0osY0FBTSxNQURGO0FBRUosZUFBTztBQUZILE9BakJJO0FBcUJWLGVBQVM7QUFDUCxjQUFNLE1BREM7QUFFUCxlQUFPO0FBRkEsT0FyQkM7QUF5QlYsa0JBQVk7QUFDVixjQUFNLE9BREk7QUFFVixlQUFPO0FBRkcsT0F6QkY7QUE2QlYsbUJBQWE7QUFDWCxjQUFNLE1BREs7QUFFWCxlQUFPO0FBRkk7QUE3QkgsS0FITjs7QUFzQ04sZ0JBQVksc0JBQVc7QUFDckIsY0FBUSxHQUFSLENBQVksbUJBQVo7QUFDRCxLQXhDSzs7QUEwQ04sU0FBSyxlQUFXOztBQUVkLFVBQUksYUFBYSxFQUFqQixDQUZjLENBRU07O0FBRXBCLFFBQUUsSUFBRixDQUFPLEtBQUssVUFBWixFQUF3QixPQUF4QixDQUFnQyxVQUFTLEdBQVQsRUFBYztBQUM1QyxtQkFBVyxHQUFYLElBQWtCLEtBQUssR0FBTCxDQUFsQjtBQUNELE9BRitCLENBRTlCLElBRjhCLENBRXpCLElBRnlCLENBQWhDOztBQUlBLGNBQVEsSUFBUixDQUFhLCtCQUFiLEVBQThDLFVBQTlDOztBQUVBLFVBQUksVUFBSixDQUFlLFVBQWY7O0FBRUEsV0FBSyxRQUFMLENBQWMsU0FBZDtBQUVELEtBeERLOztBQTBETjs7O0FBR0Esb0JBQWdCLHdCQUFTLENBQVQsRUFBWTtBQUMxQixjQUFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxDQUFoQztBQUNBLFVBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCO0FBQUEsZUFBTTtBQUFBLGlCQUFPLEdBQUcsR0FBSCxJQUFVLEVBQUUsTUFBRixDQUFTLEdBQVQsQ0FBakI7QUFBQSxTQUFOO0FBQUEsT0FBdEI7O0FBRUEsUUFBRSxJQUFGLENBQU8sRUFBRSxNQUFULEVBQWlCLE9BQWpCLENBQXlCLGNBQWMsSUFBZCxDQUF6QjtBQUNEO0FBbEVLLEdBQVI7QUFvRUQsQ0F2RUwiLCJmaWxlIjoiZWxlbWVudHMvYWNhLWNvbmZpZy9hY2EtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICBQb2x5bWVyKHtcbiAgICAgICAgaXM6ICdhY2EtY29uZmlnJyxcblxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2VhcmNoQmFzZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICdodHRwczovL2F6LWJhb2JhYi1zdXBwb3J0LmFmcm96YWFyLmNvbSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbnRlbnRCYXNlOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJ2h0dHBzOi8vYXotYmFvYmFiLmFmcm96YWFyLmNvbSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRrOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJ2F6J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXBwSWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHZhbHVlOiA4XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhcGlMOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogOVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXJzQmFzZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICdodHRwczovL3Rlc3QtaXJzLmFmcm96YWFyLmNvbS9pbWFnZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN0YW5kYWxvbmU6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbGltaXRUb1R5cGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FsZXJ0TGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJy8vVE9ETzogYWxlcnRMaW5rJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2dvOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGxldCBzZWVkQ29uZmlnID0ge307Ly8gYWxsIHRoaXMga2V5c1xuXG4gICAgICAgICAgXy5rZXlzKHRoaXMucHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHNlZWRDb25maWdba2V5XSA9IHRoaXNba2V5XTtcbiAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgY29uc29sZS5pbmZvKCdzYXZpbmcgZnJvbSBfZ28sIHNlZWRDb25maWc6ICcsIHNlZWRDb25maWcpO1xuXG4gICAgICAgICAgYXBwLnNhdmVDb25maWcoc2VlZENvbmZpZyk7XG5cbiAgICAgICAgICBwYWdlLnJlZGlyZWN0KCcvc2VhcmNoJyk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogIFRoaXMgd2lsbCBiZSBjYWxsZWQgaW4gc3RhbmRhbG9uZSBtb2RlIGFuZCBvbmx5IHdoZW4gdGhlIHJlcXVpcmVkIGtleXMgYXJlIGFsbCBwcmVzZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgX2NvbmZpZ1VwZGF0ZWQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnX2NvbmZpZ1VwZGF0ZWQ6ICcsIGUpO1xuICAgICAgICAgIGNvbnN0IHRyYW5zZmVyS2V5VG8gPSB0byA9PiBrZXkgPT4gdG9ba2V5XSA9IGUuZGV0YWlsW2tleV07XG5cbiAgICAgICAgICBfLmtleXMoZS5kZXRhaWwpLmZvckVhY2godHJhbnNmZXJLZXlUbyh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
