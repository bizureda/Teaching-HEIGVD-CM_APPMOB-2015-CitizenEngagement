// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('citizen', ['ionic', 'citizen-engagement.auth', 'citizen.constants', "leaflet-directive",'citizen.user', 'citizen.issues','citizen-engagement.map'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.run(function(AuthService, $rootScope, $state) {

  // Listen for the $stateChangeStart event of AngularUI Router.
  // This event indicates that we are transitioning to a new state.
  // We have the possibility to cancel the transition in the callback function.
  $rootScope.$on('$stateChangeStart', function(event, toState) {

    // If the user is not logged in and is trying to access another state than "login"...
    if (!AuthService.currentUserId && toState.name != 'login') {

      // ... then cancel the transition and go to the "login" state instead.
      event.preventDefault();
      $state.go('login');
    }
  });
})



.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


    // This is the abstract state for the tabs directive.
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

     .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: 'templates/login.html'
    })

    // The three next states are for each of the three tabs.
    // The state names start with "tab.", indicating that they are children of the "tab" state.
    .state('tab.user', {
      // The URL (here "/newIssue") is used only internally with Ionic; you never see it displayed anywhere.
      // In an Angular website, it would be the URL you need to go to with your browser to enter this state.
      url: '/user',
      views: {
        // The "tab-newIssue" view corresponds to the <ion-nav-view name="tab-newIssue"> directive used in the tabs.html template.
        'tab-user': {
          // This defines the template that will be inserted into the directive.
          templateUrl: 'templates/user.html'
        }
      }
    })
    .state('tab.userIssueDetails', {
      // We use a parameterized route for this state.
      // That way we'll know which issue to display the details of.
      url: '/user/userIssueDetails/:issueId',
      views: {
        // Here we use the same "tab-issueList" view as the previous state.
        // This means that the issue details template will be displayed in the same tab as the issue list.
        'tab-user': {
          templateUrl: 'templates/issueDetails.html'
//           controller:'issueDetailCtrl'
        }
      }
    })
    

    .state('tab.mapIssueDetails', {
      // We use a parameterized route for this state.
      // That way we'll know which issue to display the details of.
      url: '/issueMap/mapIssueDetails/:issueId',
      views: {
        // Here we use the same "tab-issueList" view as the previous state.
        // This means that the issue details template will be displayed in the same tab as the issue list.
        'tab-map': {
          templateUrl: 'templates/issueDetails.html'
//           controller:'issueDetailCtrl'
        }
      }
    })


    .state('tab.issueMap', {
      url: '/issueMap?issueId',
      views: {
        'tab-issueMap': {
          templateUrl: 'templates/issueMap.html', 
          controller: 'MapController'
        }
      }
    })

    .state('tab.issueList', {
      url: '/issueList',
      views: {
        'tab-issueList': {
          templateUrl: 'templates/issueList.html',
          controller:'issueListCtrl'
        }
      }
    })

   // This is the issue details state.
    .state('tab.issueDetails', {
      // We use a parameterized route for this state.
      // That way we'll know which issue to display the details of.
      url: '/issueList/issueDetails/:issueId',
      views: {
        // Here we use the same "tab-issueList" view as the previous state.
        // This means that the issue details template will be displayed in the same tab as the issue list.
        'tab-issueList': {
          templateUrl: 'templates/issueDetails.html'
//           controller:'issueDetailCtrl'
        }
      }
    })
   

  ;

  // Define the default state (i.e. the first screen displayed when the app opens).
  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('tab.user'); // Go to the new issue tab by default.
  });
})



