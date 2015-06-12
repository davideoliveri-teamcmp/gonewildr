angular.module('starter.services', [])

.service('Geolocation', ["$cordovaGeolocation", "$q", function($cordovaGeolocation, $q){

  var storedCoordinates = {};

  return {
    get: function(){
      var defer = $q.defer();
      $cordovaGeolocation.getCurrentPosition({timeout: 10000, maximumAge: 90000, enableHighAccuracy: true}).then(function(success){
          defer.resolve(success.coords);
          storedCoordinates = {lat: success.coords.latitude, lon: success.coords.lingitude};
       }, function(fail){
        defer.reject(fail);
       });
    return defer.promise;
    }, 

    getStored: function(){
      return storedCoordinates;
    }
  }

}])




.service('AuthenticationService', function() {

})

.service('RedditAPI', function($q, $http) {
    var service = {
        gonewild: gonewild
    }

    function gonewild() {
        var deferred = $q.defer();
        $http.get('http://www.reddit.com/r/gonewild/new.json')
        .success(function(response) {
            //console.log(extractImages(response.data))
            //return response.data
            console.log(response.data.children)
           deferred.resolve(extractImages(response.data));

        })
        .error(function(response) {
            console.log(response.data.message)
        })

        return deferred.promise;
    }

    function extractImages(data) {
        var images = [];

        data.children.forEach(function(element, index, array){
            var image = {};
            image.thumb = element.data.thumbnail;
            image.full = element.data.url;
            images.push(image);
        })
        return images
    }

    return service;

})

.service('LoginService', function($q, $http, $state) {
    var service = {
        login: login,
        isLogged : isLogged
    },
    authenticated = false;

    function login(username, password) {
        $http({
            method: 'GET',
            url: 'http://52.24.232.201/gone-wildr/auth/login.php?username='+username+'&password='+password,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(response){
            if (response.data) {
                console.log('SERVER RESPONSE:',response.data)
                authenticated = true;
                $state.go('latest')
            }
        })
        .error(function(response){
            console.log(response.data.message);
        })
    }

    function isLogged() {
        return authenticated;
    }
    return service;
})