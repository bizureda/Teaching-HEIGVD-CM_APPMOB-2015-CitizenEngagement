angular.module('citizen-engagement.map', ['citizen.issues']).controller("MapController", function(mapboxMapId, mapboxAccessToken, IssueService, $http, apiUrl, $state, $ionicPopover, $scope, $stateParams) {
	var issueList;
	var top = false;
	// Fonction qui permet d'afficher et de cacher les markers
	$scope.allMarkers = function() {
		$scope.markersActive = !$scope.markersActive;

		if ($scope.markersActive) {
			$scope.markerClass = '-disabled';
		} else {
			$scope.markerClass = null;
		}

		if (top == true) {
			top = false;
		} else {
			top = true;
		};
		if (top == true) {
			// récupère toutes les issues dans un objet
			IssueService.getIssues().success(function(data) {
				issueList = data;
				angular.forEach(issueList, function(value, key) {
					$scope.mapMarkers.push({
						lat: value.lat,
						lng: value.lng,
						message : value.issueType.name
// 						message: "<a ui-sref=\"tab.mapIssueDetails({issueId:'" + value.id + "'})\">" + value.issueType.name + "</a>"
					})
				});
			});
		} else {
			pos = $scope.pos;
			$scope.mapMarkers = [];
			mypos(pos);
		};
	};
	// geolocation la position de l'utilisateur.
	navigator.geolocation.getCurrentPosition(success, error, options);
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;
		$scope.mapCenter = {
			lat: crd.latitude,
			lng: crd.longitude,
			zoom: 14,
		};
		$scope.pos = pos;
		mypos(pos);
	};

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};
	var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
	mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
	$scope.mapDefaults = {
		tileLayer: mapboxTileLayer
	};
	$scope.mapCenter = {
		lat: 46.778571,
		lng: 6.640916,
		zoom: 14
	};
	$scope.mapMarkers = [];
	// cération du marker pour notre position.

	function mypos(pos) {
		var crd = pos.coords;
		$scope.crd = crd; 

		$scope.mapMarkers.push({
			lat: crd.latitude,
			lng: crd.longitude,
			icon: {
				iconUrl: "../img/avatar.png",
				iconSize: [20, 20],
			}
		});
	};

	
	// Show an issue sur la map depuis la liste des issues           
	$scope.$on('$ionicView.beforeEnter', function() {
		var issueID = $stateParams.issueId;
		if (issueID) {
			IssueService.getIssue(issueID).success(function(data) {
				var crd = data;
				$scope.mapCenter = {
					lat: crd.lat,
					lng: crd.lng,
					zoom: 15,
				};
				$scope.mapMarkers.push({
					lat: crd.lat,
					lng: crd.lng
				})
			});
		};
	});
	$ionicPopover.fromTemplateUrl('templates/newIssue.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});
})