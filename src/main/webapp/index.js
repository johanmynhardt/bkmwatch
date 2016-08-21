'use strict';

(function () {
      'use strict';

      console.debug('window: ', window.location);

      var l = window.location;
      var b = document.createElement('base');
      b.setAttribute('href', l.protocol + '//' + l.host + l.pathname);
      console.info('appending child: ', b);
      document.querySelector('head').appendChild(b);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxZQUFXO0FBQ047O0FBRUEsY0FBUSxLQUFSLENBQWMsVUFBZCxFQUEwQixPQUFPLFFBQWpDOztBQUVBLFVBQUksSUFBSSxPQUFPLFFBQWY7QUFDQSxVQUFJLElBQUksU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQVI7QUFDQSxRQUFFLFlBQUYsQ0FBZSxNQUFmLEVBQXVCLEVBQUUsUUFBRixHQUFhLElBQWIsR0FBb0IsRUFBRSxJQUF0QixHQUE2QixFQUFFLFFBQXREO0FBQ0EsY0FBUSxJQUFSLENBQWEsbUJBQWIsRUFBa0MsQ0FBbEM7QUFDQSxlQUFTLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0IsV0FBL0IsQ0FBMkMsQ0FBM0M7QUFDRCxDQVZMIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICBjb25zb2xlLmRlYnVnKCd3aW5kb3c6ICcsIHdpbmRvdy5sb2NhdGlvbik7XG5cbiAgICAgIHZhciBsID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgdmFyIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiYXNlJyk7XG4gICAgICBiLnNldEF0dHJpYnV0ZSgnaHJlZicsIGwucHJvdG9jb2wgKyAnLy8nICsgbC5ob3N0ICsgbC5wYXRobmFtZSk7XG4gICAgICBjb25zb2xlLmluZm8oJ2FwcGVuZGluZyBjaGlsZDogJywgYik7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoYik7XG4gICAgfSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
