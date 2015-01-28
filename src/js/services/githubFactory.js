angular.module('myApp').factory('githubFactory', function ($http){
    var github = {};

    github.listRepositories = function () {
        return $http.get('https://api.github.com/orgs/elasticsearch/repos?page=1&per_page=10');
    };

    github.getCommits = function (repository, page) {
        return $http.get('https://api.github.com/repos/elasticsearch/' + repository + '/commits?page=' + page + '&per_page=20');
    };

    github.getContribCount = function (repository) {
        return $http.get('https://api.github.com/repos/elasticsearch/' + repository + '/contributors');
    };

    return github;
});