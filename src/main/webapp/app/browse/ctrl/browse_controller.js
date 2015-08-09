app.controller('BrowseController', function ($scope, $log, $route, $routeParams, $location, dbService) {

    $log.debug("routeParams=" + JSON.stringify($routeParams));
    $log.debug("location=" + JSON.stringify($location));

    $scope.items = dbService.query({page: $routeParams.page, itemsPerPage: $routeParams.itemsPerPage});

    $scope.next = function () {
        $log.debug("next...");
        var next = parseInt($routeParams.page != undefined ? $routeParams.page : 0) + 1;
        $location.path('/browse/' + next).search({itemsPerPage: $routeParams.itemsPerPage != undefined ? $routeParams.itemsPerPage : 10});
    };

    $scope.previous = function () {
        $log.debug("previous...");
        var prev = parseInt($routeParams.page != undefined ? $routeParams.page : 1) - 1;
        $location.path('/browse/' + prev).search({itemsPerPage: $routeParams.itemsPerPage != undefined ? $routeParams.itemsPerPage : 10});
    };

    $scope.showPrevious = function() {
        return $routeParams.page > 0;
    };

});