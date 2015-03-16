var user = angular.module('citizen.user', []);


user.controller('userIssuesCtrl', function(UserService, $http, apiUrl, $scope) {
	var userIssuesList = UserService.getIssues();
	userIssuesList.success(function(issues){
		$scope.userIssue = userIssuesList;
	});
	$scope.showOnMap=function(issue){
		alert("Map "+issue);
		// Show issue on the map ?!!
	};
	$scope.showDetails=function(issue){
		alert("Details "+issue);
	};
});

user.controller('userCtrl', function(UserService, $http, apiUrl, $scope){
	var currentUser = UserService.getUser();
	
	currentUser.success(function(user){
		$scope.currentUser = user;
	});
});

user.factory('UserService', function($http, apiUrl){
	return{
		getUser:function(){
			return $http({ 
				method: 'GET',
				url: apiUrl + '/users/'+ currentUserID
			})
		},
		getIssues:function(){
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
user.filter('capitalize',function(){
	return function(input){
		return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
});