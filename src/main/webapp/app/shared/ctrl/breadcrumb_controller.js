app.controller('BreadcrumbController', function($scope, dbUpdate) {
    $scope.updateAlerts = function() {
        dbUpdate.query({update:true});
    }
});