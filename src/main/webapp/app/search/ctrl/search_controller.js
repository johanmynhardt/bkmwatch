app.controller('SearchController', function ($scope, $log, dbSearch) {
    $scope.search = "";

    $scope.items = [];

    $scope.doSearch = function () {
        $log.debug("search for " + $scope.search);

        $scope.items = dbSearch.query({search: $scope.search});
    }
});