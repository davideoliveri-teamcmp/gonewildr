angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.service('Geolocation', ["$cordovaGeolocation", "$q", "$geofire", function($cordovaGeolocation, $q, $geofire){
  
  var $geo = $geofire(new Firebase('https://gonewilder.firebaseio.com/'));

  var storedCoordinates = [];
  
  return {
    get: function(){
      var defer = $q.defer();
      $cordovaGeolocation.getCurrentPosition({timeout: 10000, maximumAge: 90000, enableHighAccuracy: true}).then(function(success){
          defer.resolve(success.coords);
          storedCoordinates = [success.coords.latitude, success.coords.lingitude];

          var coords = success.coords;
          // fake a push into firebase for this user with these coordinates
          $geo.$set("da_video_live", [coords.latitude, coords.longitude])
            .catch(function(err) {
                $log.error(err);
            });
       }, function(fail){
        defer.reject(fail);
       });
    return defer.promise;
    }, 
    getUpdatedPosition: function(){
      var watch = $cordovaGeolocation.watchPosition({timeout: 1000, maximumAge: 90000, enableHighAccuracy: true}); 
      return watch;  
    }, 
    getStored: function(){
      return storedCoordinates;
    }, 
    setEventForNearbyUsers: function(coords, r){
      // set a query to retrieve users whose location is close to the current one, which is the one of the authenticated user....
      var query = $geo.$query({
        center: coords, 
        radius: r
      });

      var geoQueryCallback = query.on("key_entered", "SEARCH:KEY_ENTERED");
    },
    setTestMoreUsers: function(){
      var newUserName = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ ){
      newUserName += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    var lat = Math.random()*2*41.3907;
    var lon = Math.random()*2*2.13907;
     
      $geo.$set(newUserName, [lat, lon])
            .catch(function(err) {
                $log.error(err);
            });

          
    }
    
  }

}])

