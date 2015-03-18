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

issues.controller("IssueDetailsController", function(IssueService, $http, apiUrl,$scope, $stateParams){
	var issueID = $stateParams.issueId;
	
	var issueDetails = IssueService.getIssue(issueID);
	issueDetails.success(function(issueDetails){
		$scope.issueDetails = issueDetails;
		$scope.tags=issueDetails.tags;
		$scope.comments=issueDetails.comments;
	});
	
	
	$scope.addComment=function(newComment){
		var commentTxt=$scope.newComment;
		
		var postComment = IssueService.postComment(issueID, commentTxt);
		postComment.success(function(issue){
			$scope.newComment=null;
			$scope.comments=issue.comments;
		});
	}
	
});

issues.factory('IssueService', function($http, apiUrl){
	return{
		getIssue:function(id){
			return $http({
				method: 'GET',
				url: apiUrl + '/issues/'+id,
				headers: {
				   'x-sort': 'postedOn'
				 }
			})
		},
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
		},
		postComment:function(id, txt){
			return $http({
				method: 'POST',
				url: apiUrl+'/issues/'+id+'/actions',
				data: {
					"type":"comment",
					"payload":{
						"text":txt
					}
				}
			})
		}
	}
});
issues.filter('capitalize',function(){
	return function(input){
		return  input.charAt(0).toUpperCase() + input.slice(1);
	}
});
issues.filter('date',function(){
	return function(input){
		return  input.slice(0,10);
	}
});