app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/home/view/home.html',
        controller: 'BrowseController'
    }).when('/browse', {
        templateUrl: 'app/browse/view/browse.html',
        controller: 'BrowseController'
    }).when('/browse/:page', {
        templateUrl: 'app/browse/view/browse.html',
        controller: 'BrowseController'
    }).when('/browse/:page/:itemsPerPage', {
        templateUrl: 'app/browse/view/browse.html',
        controller: 'BrowseController'
    }).when('/search', {
        templateUrl: 'app/search/view/search.html',
        controller: 'SearchController'
    });
});