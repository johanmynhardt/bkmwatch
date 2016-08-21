'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BkmAlertsTable = function () {
  function BkmAlertsTable() {
    _classCallCheck(this, BkmAlertsTable);
  }

  _createClass(BkmAlertsTable, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'bkm-alerts-table';

      this.properties = {
        items: {
          type: Array,
          value: [{ id: null, date: 'xxx', message: 'yyy' }]
        }
      };
    }
  }, {
    key: 'date',
    value: function date(asLong) {
      return new Date(asLong).toDateString();
    }
  }]);

  return BkmAlertsTable;
}();

Polymer(BkmAlertsTable);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2JrbS1hbGVydHMtdGFibGUvYmttLWFsZXJ0cy10YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTSxjOzs7Ozs7O3FDQUNxQjtBQUNmLFdBQUssRUFBTCxHQUFVLGtCQUFWOztBQUVBLFdBQUssVUFBTCxHQUFrQjtBQUNoQixlQUFPO0FBQ0wsZ0JBQU0sS0FERDtBQUVMLGlCQUFPLENBQUMsRUFBQyxJQUFJLElBQUwsRUFBVyxNQUFNLEtBQWpCLEVBQXdCLFNBQVMsS0FBakMsRUFBRDtBQUZGO0FBRFMsT0FBbEI7QUFNRDs7O3lCQUVJLE0sRUFBUTtBQUNYLGFBQU8sSUFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixZQUFqQixFQUFQO0FBQ0Q7Ozs7OztBQUVILFFBQVEsY0FBUiIsImZpbGUiOiJlbGVtZW50cy9ia20tYWxlcnRzLXRhYmxlL2JrbS1hbGVydHMtdGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBCa21BbGVydHNUYWJsZSB7XG4gICAgICAgICAgYmVmb3JlUmVnaXN0ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmlzID0gJ2JrbS1hbGVydHMtdGFibGUnO1xuXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSB7XG4gICAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IFt7aWQ6IG51bGwsIGRhdGU6ICd4eHgnLCBtZXNzYWdlOiAneXl5J31dXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0ZShhc0xvbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShhc0xvbmcpLnRvRGF0ZVN0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBQb2x5bWVyKEJrbUFsZXJ0c1RhYmxlKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
