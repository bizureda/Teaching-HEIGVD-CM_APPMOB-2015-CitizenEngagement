var issues = angular.module('citizen.issues', []);
issues.controller('issueListCtrl', function(IssueService, $http, apiUrl, $state, $scope) {
	$scope.page = 0;
	var issueList = IssueService.getIssues($scope.page);
	issueList.success(function(issues) {
		$scope.issues = issues;
		$scope.listLoaded = true;
		$scope.page++;
	});
	$scope.noMoreItemsAvailable = false;
	$scope.loadMore = function() {
		var issueList = IssueService.getIssues($scope.page);
		issueList.success(function(issues) {
			if(issues.length<10){
				$scope.noMoreItemsAvailable=true;
			}
			$scope.issues = $scope.issues.concat(issues);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page++;
		});
	};
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
	};
	$scope.togRecent = function(ord) {
		$scope.ownerOrd = '';
		$scope.stateOrd = '';
		if ($scope.reverse) {
			$scope.recentOrd = 'ion-chevron-down'
		} else {
			$scope.recentOrd = 'ion-chevron-up'
		}
	};
	$scope.togOwner = function(ord) {
		$scope.recentOrd = '';
		$scope.stateOrd = '';
		if ($scope.reverse) {
			$scope.ownerOrd = 'ion-chevron-down'
		} else {
			$scope.ownerOrd = 'ion-chevron-up'
		}
	};
	$scope.togState = function(ord) {
		$scope.recentOrd = '';
		$scope.ownerOrd = '';
		if ($scope.reverse) {
			$scope.stateOrd = 'ion-chevron-down'
		} else {
			$scope.stateOrd = 'ion-chevron-up'
		}
	};
});
issues.controller('addIssueCtrl', function(IssueService, CameraService, $http, apiUrl, $state, $scope) {
	var issueTypes = IssueService.getIssueTypes();
	issueTypes.success(function(issueTypes) {
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
	$scope.page = 0;
	var userIssueList = IssueService.getUserIssues($scope.page);
	userIssueList.success(function(issues) {
		if(issues.length==0){
			$scope.noMoreItemsAvailable=true;
			$scope.userIssues = false;
		}else{
			$scope.userIssues = issues;
		}
	});
	$scope.noMoreItemsAvailable = false;
	$scope.loadMore = function() {
		var userIssueList = IssueService.getUserIssues($scope.page);
		userIssueList.success(function(issues) {
			if(issues.length<10){
				$scope.noMoreItemsAvailable=true;
			}
			$scope.userIssues = issues;
			$scope.userIssues = $scope.userIssues.concat(issues);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page++;
			
		});
	};
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
issues.directive('actualSrc', function() {
	return {
		link: function postLink(scope, element, attrs) {
			attrs.$observe('actualSrc', function(newVal, oldVal) {
				if (newVal != undefined) {
					var img = new Image();
					img.src = attrs.actualSrc;
					angular.element(img).bind('load', function() {
						element.attr("src", attrs.actualSrc);
					});
				}
			});
		}
	}
});
issues.factory('IssueService', function($http, apiUrl) {
	return {
		getIssues: function(p) {
			return $http({
				method: 'GET',
				url: apiUrl + '/issues',
				headers: {
					'x-pagination': p + ';10'
				}
			})
		},
		getIssue: function(id) {
			return $http({
				method: 'GET',
				url: apiUrl + '/issues/' + id,
				headers: {
					'x-sort': 'postedOn'
				}
			})
		},
		getIssueTypes: function() {
			return $http({
				method: 'GET',
				url: apiUrl + '/issueTypes'
			})
		},
		getUserIssues: function(p) {
			return $http({
				method: 'GET',
				url: apiUrl + '/me/issues',
				headers: {
					'x-sort': 'updatedOn',
					'x-pagination': p + ';10'
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