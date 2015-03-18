var issues = angular.module('citizen.issues', []);

issues.controller('issueListCtrl', function(IssueService, $http, apiUrl, $state, $scope) {
	var issueList = IssueService.getIssues();
	issueList.success(function(issues){
		$scope.issues = issues;
	});
	
	$scope.showOnMap=function(issue){
// 		alert("Map "+issue);
		// Show issue on the map ?!!
	};
	$scope.showDetails=function(issue){
		$state.go("tab.issueDetails", { issueId: issue });
	};
});

issues.controller('userIssueListCtrl', function(IssueService, $http, apiUrl, $state, $scope) {
	var userIssueList = IssueService.getUserIssues();

	userIssueList.success(function(issues){
		$scope.userIssues = issues;

	});
	
	$scope.showOnMap=function(issue){
		// Show issue on the map ?!!
	};
	$scope.showDetails=function(issue){
		$state.go("tab.userIssueDetails", { issueId: issue });
	};
});

issues.controller("IssueDetailsController", function($scope, $stateParams){
	$scope.issueId = $stateParams.issueId;
	console.log($stateParams.issueId);
});

issues.factory('IssueService', function($http, apiUrl){
	return{
		getIssues:function(){
			return $http({
				method: 'GET',
				url: apiUrl + '/issues',
				headers: {
				   'x-sort': 'updatedOn'
				 }
			})
		},
		getUserIssues:function(){
			return $http({
				method: 'GET',
				url: apiUrl + '/me/issues',
				headers: {
				   'x-sort': 'updatedOn'
				 }
			})
		}
	}
});
issues.filter('capitalize',function(){
	return function(input){
		return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
});