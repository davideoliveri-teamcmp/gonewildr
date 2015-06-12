angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Geolocation) {
  $scope.location = {empty: true};
  Geolocation.get().then(function(success){
    $scope.location = {lat: success.latitude, lon: success.longitude};
  })
})

.controller('LoginCtrl', function($scope) {
    $scope.text = 'This is some text!'


  $scope.onTap = function() {
    console.log('you tapped login!')
  }
})

.controller('LatestCtrl', function($scope, RedditAPI) {
    doRefresh();
    function doRefresh() {
        RedditAPI.gonewild().then(function(data){
            $scope.images = data;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.gotoImg = function(image) {
        console.log(image)
      //  state.go('fullscreen')
    }
});





