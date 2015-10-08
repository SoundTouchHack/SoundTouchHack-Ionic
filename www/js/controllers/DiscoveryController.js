angular.module('SoundTouchHack.controller.DiscoveryController', ['ngStorage','SoundTouchHack.service.DiscoverService'])

  .controller('DiscoveryController', function($scope, $localStorage, $window, DiscoverService){

    $scope.$on('$ionicView.enter', function() {
      $scope.device = $localStorage.device;
      $scope.doRefresh();
    });

    $scope.doRefresh = function() {
      DiscoverService.getSoundTouchDevices(function(devices) {
        $scope.$apply(function () {
          $scope.devices = devices;
          $scope.$broadcast('scroll.refreshComplete');
        });
      }, function(errorMessage) {
        alert('An error occurred:' + errorMessage);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.selectSoundtouch = function() {
      console.log('selectSoundtouch');
      var device = this.device;

      DiscoverService.getSoundTouchDetail(device, function(device) {
        $localStorage.device = device;
        $window.location.href = '#/tab/soundtouch';
      });
    };

    $scope.forgetSelectedDevice = function() {
      delete $scope.device;
      delete $localStorage.device;
    };
  });
