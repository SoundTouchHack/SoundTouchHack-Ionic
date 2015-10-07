angular.module('SoundTouchHack.service.SoundTouchWebSocket', ['ngWebSocket'])

  .factory('SoundtouchWebSocket', function($websocket) {

    var factory ={};
    factory.socket = undefined;

    factory.volumeCallback = undefined;

    factory.start = function(device) {
      factory.socket = $websocket('ws://' + device.hostName + ":8080", 'gabbo');

      factory.socket.onMessage(function(message) {
        console.log(message.data);

        var data = xmlToJson($.parseXML(message.data));
        //$scope.socketData = JSON.stringify(data);
        if (angular.isDefined(data.updates)) {
          if (angular.isDefined(data.updates.volumeUpdated) && angular.isDefined(factory.volumeCallback)) {
            console.log(data.updates.volumeUpdated.volume.actualvolume['#text']);
            factory.volumeCallback(data.updates.volumeUpdated.volume.actualvolume['#text'] * 1);
          }
        }
      });
    };

    factory.registerVolumeUpdates = function(callback) {
      factory.volumeCallback = callback;
    };

    return factory;

  });
