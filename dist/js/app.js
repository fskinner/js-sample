(function(){
"use strict";
angular.module('myApp', ['ngSanitize']);
})();
(function(){
"use strict";
angular.module('myApp').controller('RepositoryController', ["$scope", "githubFactory", function ($scope, githubFactory) {

    var COMMIT_PAGE;

    function init() {
        $scope.notLoaded = true;

        $scope.repositories = [];
        $scope.commits = [];

        $scope.current_repository = {};

        $scope.stars = 0;
        $scope.forks = 0;
        $scope.contribs = 0;

        getRepositories();
    }

    $scope.loadRepositoryData = function (repo) {
        $scope.notLoaded = false;
        COMMIT_PAGE = 1;
        $scope.current_repository = repo;

        $scope.stars = repo.stargazers_count;
        $scope.forks = repo.forks_count;

        githubFactory.getContribCount(repo.name)
            .then(function (response) {
                $scope.contribs = response.data.length;
            });

        githubFactory.getCommits(repo.name, COMMIT_PAGE)
            .then(function (response) {
                $scope.commits = response.data;
            });
    };

    $scope.loadMoreCommits = function () {
        githubFactory.getCommits($scope.current_repository.name, COMMIT_PAGE)
            .then(function (response) {
                angular.forEach(response.data, function (value) {
                    $scope.commits.push(value);
                });
            });

        COMMIT_PAGE += 1;
    };

    function getRepositories() {
        githubFactory.listRepositories()
            .then(function (response) {
                $scope.repositories = response.data;
            });
    }

    init();
}]);
})();
(function(){
"use strict";
angular.module('myApp').factory('githubFactory', ["$http", function ($http){
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
}]);
})();