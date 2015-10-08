angular.module('SoundTouchHack.controller.SoundTouchController', ['ngStorage','SoundTouchHack.service.SoundTouchAPI','SoundTouchHack.service.SoundTouchWebSocket'])

.controller('SoundtouchController', function($scope, $localStorage, SoundtouchAPI, $window, SoundtouchWebSocket) {

  $scope.$on('$ionicView.enter', function() {

    /*$localStorage.device = {
        serviceName: 'TEST',
        hostName: '68c90b299e00.local.',
        port: '8090'
    };*/

    $scope.socketData = {
      volume: 0
    };

    $scope.device = $localStorage.device;

    if (typeof $scope.device !== 'undefined') {
      SoundtouchAPI.getVolume($scope.device, $scope.socketData);
      console.log('SoundtouchAPI getVolume: ' + $scope.socketData.volume);

      SoundtouchAPI.getNowPlaying($scope.device, $scope.socketData);
      console.log('SoundtouchAPI nowPlaying: ' + $scope.socketData.now_playing);

      SoundtouchWebSocket.start($scope);
    }
  });

    $scope.$on('$ionicView.leave', function() {
        SoundtouchWebSocket.stop();
    });

  $scope.volumeChanged = function() {
    console.log('Volume has changed: ' + $scope.socketData.volume);
    SoundtouchAPI.setVolume($scope.device, $scope.socketData.volume);
  };

  $scope.selectDiscoverTab = function() {
    console.log('Select Discover tab');
    $window.location.href = '#/tab/discovery';
  };

});
