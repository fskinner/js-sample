(function (){
	'use strict';

	angular.module('myApp').controller('RepositoryController', function ($scope, githubFactory) {

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
	});
})();