var issues = angular.module('citizen.issues', []);
issues.controller('issueListCtrl', function(IssueService, $http, apiUrl, $state, $scope) {
	var issueList = IssueService.getIssues();
	issueList.success(function(issues) {
		$scope.issues = issues;
		$scope.listLoaded = true;
	});
	var issueTypes = IssueService.getIssueTypes();
	issueTypes.success(function(issueTypes) {
		$scope.issueTypes = issueTypes;
	});
	$scope.showOnMap = function(issue) {
		$state.go("tab.issueMap", {
			issueId: issue
		});
	};
	$scope.showDetails = function(issue) {
		$state.go("tab.issueDetails", {
			issueId: issue
		});
	};
	$scope.clear = function() {
		$scope.ownerOrd = '';
		$scope.stateOrd = '';
		$scope.recentOrd = '';
		$scope.predicate = null;
	};
	$scope.setOrder = function(order) {
		$scope.order = order;
		console.log($scope.order);
	};
	$scope.togRecent = function(ord) {
		$scope.ownerOrd = '';
		$scope.stateOrd = '';
		if ($scope.reverse) {
			$scope.recentOrd = 'ion-chevron-up'
		} else {
			$scope.recentOrd = 'ion-chevron-down'
		}
	};
	$scope.togOwner = function(ord) {
		$scope.recentOrd = '';
		$scope.stateOrd = '';
		if ($scope.reverse) {
			$scope.ownerOrd = 'ion-chevron-up'
		} else {
			$scope.ownerOrd = 'ion-chevron-down'
		}
	};
	$scope.togState = function(ord) {
		$scope.recentOrd = '';
		$scope.ownerOrd = '';
		if ($scope.reverse) {
			$scope.stateOrd = 'ion-chevron-up'
		} else {
			$scope.stateOrd = 'ion-chevron-down'
		}
	};
});
issues.controller('addIssueCtrl', function(IssueService, CameraService, $http, apiUrl, $state, $scope) {
	var issueTypes = IssueService.getIssueTypes();
	issueTypes.success(function(issueTypes) {
		console.log(issueTypes);
		$scope.issueTypes = issueTypes;
	});
/*
	CameraService.getPicture({
		quality: 75,
		targetWidth: 400,
		targetHeight: 300,
		destinationType: Camera.DestinationType.DATA_URL
	}).then(function(imageData) {
		// do something with imageData
	});
*/
});
issues.controller('userIssueListCtrl', function(IssueService, $http, apiUrl, $state, $scope) {
	var userIssueList = IssueService.getUserIssues();
	userIssueList.success(function(issues) {
		$scope.userIssues = issues;
	});
	$scope.showOnMap = function(issue) {
		$state.go("tab.issueMap", {
			issueId: issue
		});
	};
	$scope.showDetails = function(issue) {
		$state.go("tab.userIssueDetails", {
			issueId: issue
		});
	};
});
issues.controller("IssueDetailsController", function(IssueService, $http, apiUrl, $scope, $stateParams) {
	var issueID = $stateParams.issueId;
	var issueDetails = IssueService.getIssue(issueID);
	issueDetails.success(function(issueDetails) {
		$scope.issueDetails = issueDetails;
		$scope.tags = issueDetails.tags;
		$scope.comments = issueDetails.comments;
	});
	$scope.addComment = function(newComment) {
		var commentTxt = $scope.newComment;
		var postComment = IssueService.postComment(issueID, commentTxt);
		postComment.success(function(issue) {
			$scope.newComment = null;
			$scope.comments = issue.comments;
		});
	}
});
issues.factory('IssueService', function($http, apiUrl) {
	return {
		getIssue: function(id) {
			return $http({
				method: 'GET',
				url: apiUrl + '/issues/' + id,
				headers: {
					'x-sort': 'postedOn'
				}
			})
		},
		getIssues: function() {
			return $http({
				method: 'GET',
				url: apiUrl + '/issues',
				headers: {
					'x-sort': 'updatedOn'
				}
			})
		},
		getIssueTypes: function() {
			return $http({
				method: 'GET',
				url: apiUrl + '/issueTypes'
			})
		},
		getUserIssues: function() {
			return $http({
				method: 'GET',
				url: apiUrl + '/me/issues',
				headers: {
					'x-sort': 'updatedOn'
				}
			})
		},
		postComment: function(id, txt) {
			return $http({
				method: 'POST',
				url: apiUrl + '/issues/' + id + '/actions',
				data: {
					"type": "comment",
					"payload": {
						"text": txt
					}
				}
			})
		}
	}
});
issues.factory("CameraService", function($q) {
	return {
		getPicture: function(options) {
			var deferred = $q.defer();
			navigator.camera.getPicture(function(result) {
				// do any magic you need
				deferred.resolve(result);
			}, function(err) {
				deferred.reject(err);
			}, options);
			return deferred.promise;
		}
	}
});
issues.filter('capitalize', function() {
	return function(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}
});
issues.filter('date', function() {
	return function(input) {
		return input.slice(0, 10);
	}
});