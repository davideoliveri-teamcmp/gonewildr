angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Geolocation, UsersList) {

  UsersList
    .getUsers(5)
    .then(function (res) {
      $scope.usersList = res.data.results;
      console.log($scope.usersList);
    }, function (data, status) {
      console.log('failed!', status, data);
    });

  $scope.location = {empty: true};
  Geolocation.get().then(function(success){
    $scope.location = {lat: success.latitude, lon: success.longitude};
  });

})

.controller('ChatsCtrl', function($scope, Chats) {

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
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
