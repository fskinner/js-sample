(function (){
  'use strict';

  angular.module('myApp').factory('githubFactory', function ($http){

      return {
          listRepositories: listRepositories,
          getCommits: getCommits,
          getContribCount: getContribCount
      };

      function listRepositories() {
          return $http.get('https://api.github.com/orgs/elasticsearch/repos?page=1&per_page=10');
      }

      function getCommits(repository, page) {
          return $http.get('https://api.github.com/repos/elasticsearch/' + repository + '/commits?page=' + page + '&per_page=20');
      }

      function getContribCount(repository) {
          return $http.get('https://api.github.com/repos/elasticsearch/' + repository + '/contributors');
      }
  });
})();
