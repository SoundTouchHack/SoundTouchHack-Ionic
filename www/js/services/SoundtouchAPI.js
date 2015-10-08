angular.module('SoundTouchHack.service.SoundTouchAPI', [])

  .factory('SoundtouchAPI', function($http) {

    var factory = {};

    factory.bind = function ($scope) {
      factory.device = $scope.device;
      factory.soundTouchData = $scope.soundTouchData;
    };

    //private generic getter
    factory._get = function(command, success, fail) {
      if (!angular.isDefined(fail)) {
        fail = function(data, status, headers, config) {
          alert('Getting ' + command + ' failed');
          console.log('Getting ' + command + ' failed');
        }
      }

      $http({
        method  : 'GET',
        url     : 'http://' + factory.device.hostName + ':' + factory.device.port+ '/' + command,
        timeout : 10000,
        headers: { "Content-Type": 'application/x-www-form-urlencoded' },
        transformResponse : function(data) {
          // string -> XML document --> json object
          return xmlToJson($.parseXML(data));
        }
      }).success(success).error(fail);
    };

    //private generic setter
    factory._set = function(command, dataField, success, fail) {

      if (!angular.isDefined(fail)) {
        fail = function(data, status, headers, config) {
          alert('Setting ' + command + ' failed');
          console.log('Setting ' + command + ' failed');
        }
      }

      if (!angular.isDefined(success)) {
        success = function(data, status, headers, config) {
          console.log('Setting ' + command + ' successful');
        }
      }

      $http({
        method  : 'POST',
        url     : 'http://' + factory.device.hostName + ':' + factory.device.port+ '/' + command,
        timeout : 10000,
        data    : dataField,
        headers: { "Content-Type": 'application/x-www-form-urlencoded' },
        transformResponse : function(data) {
          // string -> XML document --> json object
          return xmlToJson($.parseXML(data));
        }
      }).success(success).error(fail);
    };

    /*
     <nowPlaying deviceID="$MACADDR" source="$SOURCE">
       <ContentItem source="$SOURCE" location="$STRING" sourceAccount="$STRING" isPresetable="$BOOL">
          <itemName>$STRING</itemName>
       </ContentItem>
       <track>$STRING</track>
       <artist>$STRING</artist>
       <album>$STRING</album>
       <stationName>$STRING</stationName>
       <art artImageStatus="$ART_STATUS">$URL</art>
       <playStatus>$PLAY_STATUS</playStatus>
       <description>$STRING</description>
       <stationLocation>$STRING</stationLocation>
     </nowPlaying>
     */
    factory.getNowPlaying = function() {
      factory._get('now_playing', function(data, status, headers, config) {
        console.log(data.nowPlaying);
        factory.soundTouchData.nowPlaying = {
          stationName:  data.nowPlaying.stationName['#text'],
          artUrl:       data.nowPlaying.art['#text'],
          track:        data.nowPlaying.track['#text'],
          artist:       data.nowPlaying.artist['#text'],
          album:        data.nowPlaying.album['#text'],
          description:  data.nowPlaying.description['#text'],
        };
      });
    };

    factory.getVolume = function() {
      factory._get('volume', function(data, status, headers, config) {
        console.log(data);
        factory.soundTouchData.volume = data.volume.actualvolume['#text'];
      });
    };

    factory.getInfo= function() {
      factory._get('info', function(data, status, headers, config) {
        console.log(data);
        //TODO: add to soundTouchData
      });
    };

    factory.setVolume = function(volume) {
      factory._set('volume', '<volume>' + volume +'</volume>');
    };

    return factory;
  });
