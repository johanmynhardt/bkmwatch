'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BkmSettings = function () {
  function BkmSettings() {
    _classCallCheck(this, BkmSettings);
  }

  _createClass(BkmSettings, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'bkm-settings';

      this.properties = {};
    }
  }, {
    key: 'updateAlerts',
    value: function updateAlerts() {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('error', function (err) {
        console.error('error: ', err);
      });
      xhr.addEventListener('load', function (resp) {
        console.info('updated!');
      });
      xhr.open('GET', 'record/alerts?update=true');
      xhr.send(null);
    }
  }]);

  return BkmSettings;
}();

Polymer(BkmSettings);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2JrbS1zZXR0aW5ncy9ia20tc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQU0sVzs7Ozs7OztxQ0FDaUI7QUFDZixXQUFLLEVBQUwsR0FBVSxjQUFWOztBQUVBLFdBQUssVUFBTCxHQUFrQixFQUFsQjtBQUdEOzs7bUNBRWM7QUFDYixVQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7QUFDQSxVQUFJLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFVBQUMsR0FBRCxFQUFTO0FBQUUsZ0JBQVEsS0FBUixDQUFjLFNBQWQsRUFBeUIsR0FBekI7QUFBK0IsT0FBeEU7QUFDQSxVQUFJLGdCQUFKLENBQXFCLE1BQXJCLEVBQTZCLFVBQUMsSUFBRCxFQUFVO0FBQUUsZ0JBQVEsSUFBUixDQUFhLFVBQWI7QUFBMkIsT0FBcEU7QUFDQSxVQUFJLElBQUosQ0FBUyxLQUFULEVBQWdCLDJCQUFoQjtBQUNBLFVBQUksSUFBSixDQUFTLElBQVQ7QUFDRDs7Ozs7O0FBR0gsUUFBUSxXQUFSIiwiZmlsZSI6ImVsZW1lbnRzL2JrbS1zZXR0aW5ncy9ia20tc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBCa21TZXR0aW5ncyB7XG4gICAgICBiZWZvcmVSZWdpc3RlcigpIHtcbiAgICAgICAgdGhpcy5pcyA9ICdia20tc2V0dGluZ3MnO1xuXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHtcblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZUFsZXJ0cygpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXJyKSA9PiB7IGNvbnNvbGUuZXJyb3IoJ2Vycm9yOiAnLCBlcnIpO30pO1xuICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChyZXNwKSA9PiB7IGNvbnNvbGUuaW5mbygndXBkYXRlZCEnKTsgfSk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCAncmVjb3JkL2FsZXJ0cz91cGRhdGU9dHJ1ZScpO1xuICAgICAgICB4aHIuc2VuZChudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBQb2x5bWVyKEJrbVNldHRpbmdzKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
