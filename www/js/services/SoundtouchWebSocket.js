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
          var updates = data.updates;

          if (angular.isDefined(updates.volumeUpdated)) {
            //This is a volume changed packet
            var volume = updates.volumeUpdated.volume.actualvolume['#text'];
            console.log('Volume is changed to ' + volume);
            factory.$scope.soundTouchData.volume = volume;
          } else if (false) {

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
