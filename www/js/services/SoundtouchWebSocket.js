angular.module('SoundTouchHack.service.SoundTouchWebSocket', ['ngWebSocket'])

  .factory('SoundtouchWebSocket', function($websocket) {

    var factory ={};
    factory.socket = undefined;
    factory.$scope = undefined;

    factory.start = function($scope) {
      var device = $scope.device;

      if (angular.isDefined(factory.socket)) {
        factory.socket.close(true);
      }

      factory.$scope = $scope;
      factory.socket = $websocket('ws://' + device.hostName + ":8080", 'gabbo');

      factory.socket.onMessage(function(message) {
        //console.log(message.data);

        var data = xmlToJson($.parseXML(message.data));
        factory.$scope.socketDataDebug = data;

        if (angular.isDefined(data.updates)) {
          if (angular.isDefined(data.updates.volumeUpdated)) {
            var volume = data.updates.volumeUpdated.volume.actualvolume['#text'];
            console.log('Volume changed to ' + volume);
            factory.$scope.socketData.volume = volume;
          }
        }
      });
    };

    factory.stop = function() {
      if (angular.isDefined(factory.socket)) {
        factory.socket.close(true);
      }
    };

    return factory;

  });
