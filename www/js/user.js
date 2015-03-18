var user = angular.module('citizen.user', ['angular-storage']);



user.controller('userCtrl', function(UserService, $http, apiUrl, store, $scope){
	var userID=store.get('currentUserId');
	var currentUser = UserService.getUser(userID);
	currentUser.success(function(user){
		$scope.currentUser = user;
	});
});

user.factory('UserService', function($http, apiUrl){
	return{
		getUser:function(id){
			return $http({ 
				method: 'GET',
				url: apiUrl + '/users/'+id
			})
		}

	}
});
user.filter('capitalize',function(){
	return function(input){
		return  input.charAt(0).toUpperCase() + input.slice(1);
	}
});