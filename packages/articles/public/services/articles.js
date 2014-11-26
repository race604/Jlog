'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('Articles', ['$resource',
  function($resource) {
    return $resource('articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      total: {
        method: 'GET',
        params: {articleId: 'total'}
      },
      page:{
        method: 'GET',
        params: {articleId: 'p'},
        isArray: true
      },
    });
  }
]);
