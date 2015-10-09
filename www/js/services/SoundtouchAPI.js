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
          alert('Setting ' + command + ' (' + dataField + ') failed');
          console.log('Setting ' + command + ' (' + dataField + ') failed');
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
          source:       data.nowPlaying.attributes.source['#text'],
          stationName:  data.nowPlaying.stationName['#text'],
          artUrl:       data.nowPlaying.art['#text'],
          track:        data.nowPlaying.track['#text'],
          artist:       data.nowPlaying.artist['#text'],
          album:        data.nowPlaying.album['#text'],
          description:  data.nowPlaying.description['#text'],
          stationLocation:  data.nowPlaying.stationLocation['#text'],
        };
      });
    };

    factory.getVolume = function() {
      factory._get('volume', function(data, status, headers, config) {
        console.log(data);
        factory.soundTouchData.volume = data.volume.actualvolume['#text'];
      });
    };

    /*
     <info deviceID="$MACADDR">
       <name>$STRING</name>
       <type>$STRING</type>
       <margeAccountUUID>$STRING</margeAccountUUID>
       <components>
         <component>
           <componentCategory>$STRING</componentCategory>
           <softwareVersion>$STRING</softwareVersion>
           <serialNumber>$STRING</serialNumber>
         </component>
         ...
       </components>
       <margeURL>$URL</margeURL>
       <networkInfo type="$STRING">
       <macAddress>$MACADDR</macAddress>
       <ipAddress>$IPADDR</ipAddress>
       </networkInfo>
        ...
     </info>
     */
    factory.getInfo= function() {
      factory._get('info', function(data, status, headers, config) {
        console.log(data);
        //TODO: add to soundTouchData
      });
    };

    factory.setVolume = function(volume) {
      factory._set('volume', '<volume>' + volume +'</volume>');
    };

    /*
    Allowed keys:
     PLAY, PAUSE, STOP, PREV_TRACK, NEXT_TRACK, THUMBS_UP, THUMBS_DOWN, BOOKMARK, POWER, MUTE, VOLUME_UP, VOLUME_DOWN
     PRESET_1, PRESET_2, PRESET_3, PRESET_4, PRESET_5, PRESET_6, AUX_INPUT, SHUFFLE_OFF, SHUFFLE_ON, REPEAT_OFF
     REPEAT_ONE, REPEAT_ALL, PLAY_PAUSE, ADD_FAVORITE, REMOVE_FAVORITE, INVALID_KEY
     */
    factory.pressKey = function(key) {
      factory._set('key', '<key state="press" sender="Gabbo">' + key + '</key>', function() {
        factory._set('key', '<key state="release" sender="Gabbo">' + key + '</key>');
      });
    };

    return factory;
  });
