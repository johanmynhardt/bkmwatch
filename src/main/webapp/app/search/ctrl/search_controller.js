app.controller('SearchController', function ($scope, $log, dbSearch) {
    $scope.search = "";

    $scope.items = [];

    $scope.searchState = {
        search: "",
        searched: false,
        searching: false,
        searchDone: function() {
            this.searched = true;
            this.searching = false;
        },
        dirty: function(term) {
            this.search = term;
            this.searched = false;
        },
        setSearching: function() {
            this.searching = true;
            $scope.items = [];
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
                $scope.searchState.searchDone();
                $scope.items = data;
            },
            function (error) {
                $log.error("Error searching for '%s': %o", $scope.search, error);
                $scope.searchState.searchDone();
            }
        );
    }
});