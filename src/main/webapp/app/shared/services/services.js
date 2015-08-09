var dbService = app.factory('dbService', function ($resource) {
    return $resource('record/alerts', {}, {'query': {method: 'GET', isArray: true}});
});

var dbSearch = app.factory('dbSearch', function ($resource) {
    return $resource('record/search', {}, {'query': {method: 'GET', isArray: true}});
});

var dbUpdate = app.factory('dbUpdate', function($resource){
    return $resource('record/alerts', {}, {update:true});
});