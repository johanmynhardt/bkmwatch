angular.module('app')
    .factory('dbService', function ($resource) {
        return $resource('record/alerts', {}, {'query': {method: 'GET', isArray: true}});
    })
    .factory('dbSearch', function ($resource) {
        return $resource('record/search', {}, {'query': {method: 'GET', isArray: true}});
    })
    .factory('dbUpdate', function ($resource) {
        return $resource('record/alerts', {}, {update: true});
    });