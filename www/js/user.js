var user = angular.module('citizen.user', []);

user.controller('userListCtrl', function($http, apiUrl, $scope) {
	$http({
		method: 'GET',
		url: apiUrl + '/me/issues'
	}).success(function(userIssues) {
		$scope.userIssues = userIssues;
	});
});