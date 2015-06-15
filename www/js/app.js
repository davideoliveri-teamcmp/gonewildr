// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'firebase', 'angularGeoFire'])

.run(function($ionicPlatform, Geolocation, Members, $geofire) {
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

    // var $geo = $geofire(new Firebase('https://gonewilder.firebaseio.com/'));
     // $cordovaGeolocation.getCurrentPosition({timeout: 10000, maximumAge: 90000, enableHighAccuracy: true}).then(function(success){
     //    console.log(success);
        
       
     // });
    Geolocation.get().then(function(success){
        
        var locArray = [];
        locArray.push(success.latitude);
        locArray.push(success.longitude);
        console.log("setting event for nearby user")
          Geolocation.setEventForNearbyUsers(locArray, 300);
          Geolocation.pushLocationToDB();

          // setMemberInfo requires the userName and the info for that user in a form of Object.
          // this will add a new entry in 'https://gonewilder.firebaseio.com/members_profiles/'+<user>
          Members.setMemberInfo("da_video_live", {"da_video_live": {pic: "http://lorempixel.com/300/300/people/4"}})
      });
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl', 
        resolve: {
          nearby: function(Geolocation){
            return Geolocation.getListOfCloseMembers();
          }
        }
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingCtrl'
      }
    }
  })

  .state('tab.home', {
    url: '/home', 
    views: {
      'tab-home':{
        templateUrl: 'templates/tab-home.html', 
        controller: "HomeCtrl", 
        resolve: {
          latestPosts: function(GoWilderPost){
            return GoWilderPost.getLatest();
          }
        }
      }
    }
  })

  .state('tab.map', {
    url: '/map', 
    views: {
      'tab-map':{
        templateUrl: 'templates/tab-map.html', 
        controller: "MapCtrl", 
        resolve: {
          location: function(Geolocation){
            Geolocation.get(); // call this to be sure you have set the storedCoordinates array in the service (pretty dirty eh?)
            return Geolocation.getStored();
          }
        }
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
