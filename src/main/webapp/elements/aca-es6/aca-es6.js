'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AcaEs6 = function () {
  function AcaEs6() {
    _classCallCheck(this, AcaEs6);
  }

  _createClass(AcaEs6, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'aca-es6';

      this.properties = {
        strapLine: {
          type: String,
          value: ''
        },
        beta: {
          type: String,
          value: ''
        }
      };
    }
  }, {
    key: 'created',
    value: function created() {}
  }, {
    key: 'ready',
    value: function ready() {
      this.beta = ['a', 'b', 'c'].map(function (x) {
        return '_' + x;
      });
    }
  }, {
    key: 'attached',
    value: function attached() {}
  }, {
    key: 'detached',
    value: function detached() {}
  }, {
    key: 'attributeChanged',
    value: function attributeChanged() {}
  }]);

  return AcaEs6;
}();

Polymer(AcaEs6);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1lczYvYWNhLWVzNi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTSxNOzs7Ozs7O3FDQUNpQjtBQUNmLFdBQUssRUFBTCxHQUFVLFNBQVY7O0FBRUEsV0FBSyxVQUFMLEdBQWtCO0FBQ2hCLG1CQUFXO0FBQ1QsZ0JBQU0sTUFERztBQUVULGlCQUFPO0FBRkUsU0FESztBQUtoQixjQUFNO0FBQ0osZ0JBQU0sTUFERjtBQUVKLGlCQUFPO0FBRkg7QUFMVSxPQUFsQjtBQVVEOzs7OEJBRVMsQ0FDVDs7OzRCQUVPO0FBQ04sV0FBSyxJQUFMLEdBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FBb0IsVUFBQyxDQUFEO0FBQUEsZUFBTyxNQUFNLENBQWI7QUFBQSxPQUFwQixDQUFaO0FBQ0Q7OzsrQkFFVSxDQUNWOzs7K0JBRVUsQ0FDVjs7O3VDQUVrQixDQUNsQjs7Ozs7O0FBR0gsUUFBUSxNQUFSIiwiZmlsZSI6ImVsZW1lbnRzL2FjYS1lczYvYWNhLWVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFjYUVzNiB7XG4gICAgICBiZWZvcmVSZWdpc3RlcigpIHtcbiAgICAgICAgdGhpcy5pcyA9ICdhY2EtZXM2JztcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSB7XG4gICAgICAgICAgc3RyYXBMaW5lOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJydcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJldGE6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY3JlYXRlZCgpIHtcbiAgICAgIH1cblxuICAgICAgcmVhZHkoKSB7XG4gICAgICAgIHRoaXMuYmV0YSA9IFsnYScsICdiJywgJ2MnXS5tYXAoKHgpID0+ICdfJyArIHgpO1xuICAgICAgfVxuXG4gICAgICBhdHRhY2hlZCgpIHtcbiAgICAgIH1cblxuICAgICAgZGV0YWNoZWQoKSB7XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWQoKSB7XG4gICAgICB9XG4gICAgfVxuXG4gICAgUG9seW1lcihBY2FFczYpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
