// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $cordovaGeolocation, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

     $cordovaGeolocation.getCurrentPosition({timeout: 10000, maximumAge: 90000, enableHighAccuracy: true}).then(function(success){
        console.log(success);
     });
  });

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !AuthenticationService.isLoggedIn()) {
                $state.go('login');
                event.preventDefault();
            }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    $stateProvider

  // setup an abstract state for the tabs directive
        .state('login', {
            url: '/login',
            //abstract: true,
            templateUrl: "templates/login.html",
            controller: "LoginCtrl",
            authenticate: false
        })

        .state('latest', {
            url: '/latest',
            templateUrl: 'templates/latest.html',
            controller: 'LatestCtrl'
        })

      // Each tab has its own nav history stack:

        function authenticate($q, user, $state, $timeout) {
          if (user.isAuthenticated()) {
            // Resolve the promise successfully
            return $q.when()
          } else {
            // The next bit of code is asynchronously tricky.

            $timeout(function() {
              // This code runs after the authentication promise has been rejected.
              // Go to the log-in page
              $state.go('login')
            })

            // Reject the authentication promise to prevent the state from loading
            return $q.reject()
          }
    }

  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});
