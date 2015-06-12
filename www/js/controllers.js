angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Geolocation, $interval, UsersList) {

  UsersList
    .getUsers(5)
    .then(function (res) {
      $scope.usersList = res.data.results;
      console.log($scope.usersList);
    }, function (data, status) {
      console.log('failed!', status, data);
    });

  // uncomment the line below to get a chance to discover more users nearby... it simply add random users to the db
  // $interval(function(){
  //   Geolocation.setTestMoreUsers()
  // }, 1000);

  $scope.nearbyUsers = [];
 // Listen for Angular Broadcast
  $scope.$on("SEARCH:KEY_ENTERED", function (event, key, location, distance) {
      // Do something interesting with object
      $scope.nearbyUsers.push({name: key, location: location, distance: distance});
      // console.log(key, location, distance)
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