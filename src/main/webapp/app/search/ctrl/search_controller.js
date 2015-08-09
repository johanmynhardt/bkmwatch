app.controller('SearchController', function ($scope, $log, $routeParams, $location, dbSearch) {


    $log.debug("routeParams=%o", $routeParams);
    $log.debug("location=%o", $location);

    $scope.search = "";

    $scope.items = {
        page: 0,
        pages: 0,
        data: [],
        updateData: function (data) {
            this.data = data;
            this.pages = Math.ceil(this.data.length / 10);
            this.page = parseInt($routeParams['page'] ? $routeParams['page'] : 1);
            $log.debug("$scope.items=%o", this);
            this.recalculate();
        },
        recalculate: function () {
            $log.debug("Recalculating for page %s", this.page);
            var start = (this.page - 1) * 10;
            $scope.results = this.data.slice(start, start + 10);
        }
    };

    $scope.next = function () {
        if ($scope.items.page < $scope.items.pages) {
            $scope.items.page++;
            $scope.items.recalculate();
        }
    };

    $scope.end = function () {
        if ($scope.items.page < $scope.items.pages) {
            $scope.items.page = $scope.items.pages;
            $scope.items.recalculate();
        }
    };

    $scope.previous = function () {
        if ($scope.items.page > 1) {
            $scope.items.page--;
            $scope.items.recalculate();
        }
    };

    $scope.start = function () {
        if ($scope.items.page > 1) {
            $scope.items.page = 1;
            $scope.items.recalculate();
        }
    };

    $scope.results = [];

    $scope.searchState = {
        search: "",
        searched: false,
        searching: false,
        searchDone: function (data) {
            this.searched = true;
            this.searching = false;
            $scope.items.updateData(data);
        },
        dirty: function (term) {
            this.search = term;
            this.searched = false;
        },
        setSearching: function () {
            this.searching = true;
            $scope.results = [];
        }
    };

    $scope.$watch('search', function (newValue, old) {
        $scope.searchState.dirty(newValue);
    });

    $scope.doSearch = function () {

        if ($scope.search.length <= 0) {
            return;
        }

        $log.debug("search for " + $scope.search);

        $scope.searchState.setSearching();

        dbSearch.query(
            {search: $scope.search},
            function (data) {
                $scope.searchState.searchDone(data);
            },
            function (error) {
                $log.error("Error searching for '%s': %o", $scope.search, error);
                $scope.searchState.searchDone([]);
            }
        );
    }
});