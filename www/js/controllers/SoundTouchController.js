angular.module('SoundTouchHack.controller.SoundTouchController', ['ngStorage','SoundTouchHack.service.SoundTouchAPI','SoundTouchHack.service.SoundTouchWebSocket'])

.controller('SoundtouchController', function($scope, $localStorage, SoundtouchAPI, $window, SoundtouchWebSocket) {

  $scope.$on('$ionicView.enter', function() {

    /*$localStorage.device = {
        serviceName: 'TEST',
        hostName: '68c90b299e00.local.',
        port: '8090'
    };*/

    $scope.soundTouchData = {
      volume: 0,
      nowPlaying: {
        stationName:  '<Radio station>',
        artUrl:       'http://www.poulissen.nl/sites/default/files/imagecache/pagina_image/bose-soundtouch.jpg',
        track:        '<Track>',
        artist:       '<Artist>',
        album:        '<Album>',
        description:  '<Description>'
      }
    };

    $scope.device = $localStorage.device;

    if (typeof $scope.device !== 'undefined') {

      SoundtouchAPI.bind($scope);

      SoundtouchAPI.getVolume();
      SoundtouchAPI.getNowPlaying();
      SoundtouchAPI.getInfo();

      SoundtouchWebSocket.start($scope);
    }
  });

  $scope.$on('$ionicView.leave', function() {
      SoundtouchWebSocket.stop();
  });

  $scope.volumeChanged = function() {
    console.log('Volume has changed: ' + $scope.soundTouchData.volume);
    SoundtouchAPI.setVolume($scope.soundTouchData.volume);
  };

  $scope.pressKey = function(key) {
    SoundtouchAPI.pressKey(key);
  };

  $scope.selectDiscoverTab = function() {
    console.log('Select Discover tab');
    $window.location.href = '#/tab/discovery';
  };

});
