'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'aca-file-download-link',
    properties: {
      targetLocation: {
        type: String,
        value: '',
        notify: true
      },

      title: {
        type: String,
        value: 'Download'
      }
    },

    followLink: function followLink() {
      console.trace('following link: ', this.targetLocation);
      if (this.targetLocation) {
        window.open(this.targetLocation);
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2FjYS1maWxlLWRvd25sb2FkL2FjYS1maWxlLWRvd25sb2FkLWxpbmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFlBQVc7QUFDTjs7QUFFQSxVQUFRO0FBQ04sUUFBSSx3QkFERTtBQUVOLGdCQUFZO0FBQ1Ysc0JBQWdCO0FBQ2QsY0FBTSxNQURRO0FBRWQsZUFBTyxFQUZPO0FBR2QsZ0JBQVE7QUFITSxPQUROOztBQU9WLGFBQU87QUFDTCxjQUFNLE1BREQ7QUFFTCxlQUFPO0FBRkY7QUFQRyxLQUZOOztBQWVOLGdCQUFZLHNCQUFXO0FBQ3JCLGNBQVEsS0FBUixDQUFjLGtCQUFkLEVBQWtDLEtBQUssY0FBdkM7QUFDQSxVQUFJLEtBQUssY0FBVCxFQUF5QjtBQUN2QixlQUFPLElBQVAsQ0FBWSxLQUFLLGNBQWpCO0FBQ0Q7QUFDRjtBQXBCSyxHQUFSO0FBc0JELENBekJMIiwiZmlsZSI6ImVsZW1lbnRzL2FjYS1maWxlLWRvd25sb2FkL2FjYS1maWxlLWRvd25sb2FkLWxpbmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgIFBvbHltZXIoe1xuICAgICAgICBpczogJ2FjYS1maWxlLWRvd25sb2FkLWxpbmsnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdGFyZ2V0TG9jYXRpb246IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIG5vdGlmeTogdHJ1ZVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICdEb3dubG9hZCdcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9sbG93TGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc29sZS50cmFjZSgnZm9sbG93aW5nIGxpbms6ICcsIHRoaXMudGFyZ2V0TG9jYXRpb24pO1xuICAgICAgICAgIGlmICh0aGlzLnRhcmdldExvY2F0aW9uKSB7XG4gICAgICAgICAgICB3aW5kb3cub3Blbih0aGlzLnRhcmdldExvY2F0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
