angular.module('SoundTouchHack.service.SoundTouchWebSocket', ['ngWebSocket', 'SoundTouchHack.service.SoundTouchAPI'])

  .factory('SoundtouchWebSocket', function($websocket, SoundtouchAPI) {

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
          } else if (angular.isDefined(updates.nowSelectionUpdated)) {
            // now selection updates is triggered when a station will be changed, but at this moment nothing is playing ...
            factory.$scope.soundTouchData.nowPlaying = {
              source:           '',
              stationName:      '',
              artUrl:           '',
              track:            '',
              artist:           '',
              album:            '',
              stationLocation:  '',
            };
          } else if (angular.isDefined(updates.nowPlayingUpdated)) {
            var nowPlaying = updates.nowPlayingUpdated.nowPlaying;
            factory.$scope.soundTouchData.nowPlaying = {
              source:           nowPlaying.attributes.source['#text'],
              stationName:      nowPlaying.stationName['#text'],
              artUrl:           nowPlaying.art['#text'],
              track:            nowPlaying.track['#text'],
              artist:           nowPlaying.artist['#text'],
              album:            nowPlaying.album['#text'],
              stationLocation:  nowPlaying.stationLocation['#text'],
            };
          } else {
            console.log(updates);
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
