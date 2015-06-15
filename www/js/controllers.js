angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Geolocation) {
  $scope.location = {empty: true};
  Geolocation.get().then(function(success){
    $scope.location = {lat: success.latitude, lon: success.longitude};
  })
})

.controller('LoginCtrl', function($scope, LoginService) {
    $scope.text = 'This is some text!'


  $scope.onTap = function(username, password) {
    //console.log('you tapped login!')
    LoginService.login(username, password)
  }
})

.controller('LatestCtrl', function($scope, RedditAPI, $ionicModal, $timeout, $ionicSlideBoxDelegate) {
    initData();

    function initData() {
        RedditAPI.gonewild().then(function(data) {
            console.log('initialized images');
            $scope.images = data;
        })
    };
    $scope.doRefresh = function() {
        console.log('refreshing!');
        RedditAPI.gonewild().then(function(data){
            console.log('refreshed images!')
            $scope.images = data.concat($scope.images);
            $scope.$broadcast('scroll.refreshComplete');
        })

    };

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        //console.log('$scope.modal is:', $scope.modal)
    });

    $scope.openModal = function(idx) {
        $ionicSlideBoxDelegate(idx)
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.goToSlide = function(index) {
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    }
  
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execu
})




.controller('HomeCtrl', function($scope){

})