angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope) {
    $scope.text = 'This is some text!'


  $scope.onTap = function() {
    console.log('you tapped login!')
  }
})

.controller('TestCtrl', function($scope, RedditAPI) {
RedditAPI.gonewild().then(function(data){
    console.log('ctrl data', data)
    $scope.images = data;
})
})




.controller('DashCtrl', function($scope) {})

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
})


