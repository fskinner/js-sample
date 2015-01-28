(function(){
"use strict";
angular.module('myApp', ['ngSanitize']);
})();
(function(){
"use strict";
angular.module('myApp').controller('RepositoryController', ["githubFactory", function (githubFactory) {
    var vm = this;

    var COMMIT_PAGE;

    vm.loadMoreCommits = loadMoreCommits;
    vm.loadRepositoryData = loadRepositoryData;

    function init() {
        vm.notLoaded = true;

        vm.repositories = [];
        vm.commits = [];

        vm.current_repository = {};

        vm.stars = 0;
        vm.forks = 0;
        vm.contribs = 0;

        getRepositories();
    }

    function loadRepositoryData(repo) {
        vm.notLoaded = false;
        COMMIT_PAGE = 1;
        vm.current_repository = repo;

        vm.stars = repo.stargazers_count;
        vm.forks = repo.forks_count;

        githubFactory.getContribCount(repo.name)
            .then(function (response) {
                vm.contribs = response.data.length;
            });

        githubFactory.getCommits(repo.name, COMMIT_PAGE)
            .then(function (response) {
                vm.commits = response.data;
            });
    }

    function loadMoreCommits() {
        githubFactory.getCommits(vm.current_repository.name, COMMIT_PAGE)
            .then(function (response) {
                angular.forEach(response.data, function (value) {
                    vm.commits.push(value);
                });
            });

        COMMIT_PAGE += 1;
    }

    function getRepositories() {
        githubFactory.listRepositories()
            .then(function (response) {
                vm.repositories = response.data;
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