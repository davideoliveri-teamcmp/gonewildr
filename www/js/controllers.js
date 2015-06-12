angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Geolocation, $interval) {
  $scope.location = {empty: true};
  Geolocation.get().then(function(success){
    $scope.location = {lat: success.latitude, lon: success.longitude};
    var locArray = [];
    locArray.push(success.latitude);
    locArray.push(success.longitude);
      Geolocation.setEventForNearbyUsers(locArray, 200);
  });

// uncomment this to generate random users that may be close to the selected one 'da_video_live'
  // $interval(function(){
  //    Geolocation.setTestMoreUsers();
  //       }, 2000);
  Geolocation.getUpdatedPosition().then(null, function(error){
    
  }, function(position){
    console.log(
      "updated posaition on wahcth", position)
    // $scope.location = {lat: success.latitude, lon: success.longitude};
  })
  $scope.nearbyUsers = [];
 // Listen for Angular Broadcast
  $scope.$on("SEARCH:KEY_ENTERED", function (event, key, location, distance) {
      // Do something interesting with object
      $scope.nearbyUsers.push({name: key, location: location, distance: distance});
      console.log(event, key, location, distance)
      // Cancel the query if the distance is > 5 km
      if(distance > 5) {
          // geoQueryCallback.cancel();
      }
  });
})

.controller('ChatsCtrl', function($scope, Chats, Geolocation) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }

  // Geolocation.setEventForNearbyUsers(20);
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
