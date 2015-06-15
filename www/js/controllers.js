angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Geolocation, Members, $interval, nearby) {

 // uncomment the line below to get a chance to discover more users nearby... it simply add random users to the db
  // $interval(function(){
  //   Geolocation.setTestMoreUsers()
  // }, 2000);

  $scope.nearbyUsers = nearby;
 // Listen for Angular Broadcast
  $scope.$on("SEARCH:KEY_ENTERED", function (event, key, location, distance) {
      // Do something interesting with object
      $scope.nearbyUsers.push({name: key, location: location, distance: distance});
      // console.log(key, location, distance)
  });
})

.controller('LoginCtrl', function($scope, Chats, Geolocation) {


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
})

.controller('HomeCtrl', function($scope, $cordovaInAppBrowser, latestPosts) {
  $scope.latestPosts = latestPosts.data.children;
  console.log($scope.latestPosts);

  // $scope.openPostUrl =  function(index){
  //   // window.open(url, "_blank", "location=yes");
  // }

    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'DONE?'
    };


    $scope.openPostUrl = function(index) {
      var url = $scope.latestPosts[index].data.url;
      $cordovaInAppBrowser.open(url, '_blank', options)
        .then(function(event) {
          // success
        })
        .catch(function(event) {
          // error
        });
    }

})

.controller('SettingCtrl', function($scope, $interval, Geolocation) {
  $scope.toggle = {
    addUser: false
  };
  

  var addingUser;
  $scope.toggleAddUsers = function(){
    $scope.toggle.addUser = !$scope.toggle.addUser;

    if($scope.toggle.addUser){
      console.log("launch interval");
      if(!angular.isDefined(addingUser)){
        addingUser = $interval(function(){
          Geolocation.setTestMoreUsers();
        }, 2500);        
      }
    } else {
      console.log("clear interval");
     
     if(angular.isDefined(addingUser)){
        $interval.cancel(addingUser);
        addingUser = undefined;      
     }
      
    }
    console.log(addingUser);
  }
  


})

.controller("MapCtrl", ["$scope", "$ionicLoading", "$compile", "Geolocation", "location", function($scope, $ionicLoading, $compile, Geolocation, location) {

    var controllerMemberStorage = [];
    var map;
    $scope.initialize = function() {
        var thisUser = {
            name: "You",
            location: Geolocation.getStored()
        };
        var thisUser = {
            name: "You",
            location: location
        };
        // var thisUser = {name: "You", location: [40.4167754, -3.7037902]};
        console.log("called initialize", thisUser);
        var closeMembers = Geolocation.getListOfCloseMembers();
        console.log(closeMembers)
            //var site = new google.maps.LatLng(55.9879314,-4.3042387);
            //var hospital = new google.maps.LatLng(55.8934378,-4.2201905);

        function pinSymbol(color) {
            return {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#000',
                strokeWeight: 2,
                scale: 1,
            };
        }

        var pinColor = "276394";
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));


        var yourLocationOnMap = new google.maps.LatLng(thisUser.location[0], thisUser.location[1]);
        var mapOptions = {
            streetViewControl: false,
            center: yourLocationOnMap,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        angular.forEach(closeMembers, function(member, index) {
            var newLocation = new google.maps.LatLng(member.location[0], member.location[1]);
            var newMemberMarker = new google.maps.Marker({
                position: newLocation,
                map: map,
                title: member.name
            });

            var newInfoWindow = new google.maps.InfoWindow({
                content: member.name
            });

            //newInfoWindow.open(map, newMemberMarker);

            var newMember = {
                marker: newMemberMarker,
                location: newLocation,
                infowindow: newInfoWindow
            }
            google.maps.event.addListener(newMemberMarker, 'click', function() {
                newInfoWindow.open(map, newMemberMarker);
            });
            //controllerMemberStorage.push(newMember);
        });

        var markerYOU = new google.maps.Marker({
            position: yourLocationOnMap,
            map: map,
            icon: pinSymbol("#FFF"),

            title: thisUser.name
        });

        var infowindow = new google.maps.InfoWindow({
            content: thisUser.name
        });

        google.maps.event.addListener(markerYOU, 'click', function() {
            infowindow.open(map, markerYOU);
        });

        $scope.map = map;

    }

    // try this also: ionic.Platform.ready($scope.initialize);

    google.maps.event.addDomListener(window, 'load', $scope.initialize);

    $scope.centerOnMe = function() {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

    $scope.$on("SEARCH:KEY_ENTERED", function(event, key, location, distance) {

        var newLocation = new google.maps.LatLng(location[0], location[1]);
        var newMemberMarker = new google.maps.Marker({
            position: newLocation,
            map: map,
            title: key
        });

        google.maps.event.addListener(newMemberMarker, 'click', function() {
            //infowindow.open(map,newMemberMarker);
        });
    })
}])



.controller('UserlistCtrl', function($scope, Geolocation, Members, $interval, nearby) {

    $scope.nearbyUsers = nearby;
    // Listen for Angular Broadcast
    $scope.$on("SEARCH:KEY_ENTERED", function(event, key, location, distance) {
        // Do something interesting with object
        $scope.nearbyUsers.push({
            name: key,
            location: location,
            distance: distance
        });
        // console.log(key, location, distance)
    });
})


.controller('ChatsCtrl', function($scope, Chats, Geolocation) {


    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})


