angular.module('SoundTouchHack.service.SoundTouchAPI', [])

  .factory('SoundtouchAPI', function($http) {

    return {
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
      getNowPlaying: function(device) {
        $http({
            method  : 'GET',
            url     : 'http://' + device.hostName + ':' + device.port+ '/now_playing',
            timeout : 10000,
            headers: { "Content-Type": 'application/x-www-form-urlencoded' },
            transformResponse : function(data) {
              // string -> XML document object
              return data;
            }
          }).success(function(data, status, headers, config) {
            console.dir(data);  // XML document object
            var xmlDoc = $.parseXML(data)
            device.now_playing = $(xmlDoc).find("stationName").text();
          }).error(function(data, status, headers, config) {
            console.log('FAILED');
            console.log(status);
          });
      },

      setVolume: function(device) {
        $http({
          method  : 'POST',
          url     : 'http://' + device.hostName + ':' + device.port+ '/volume',
          timeout : 10000,
          data    : '<volume>' + device.volume +'</volume>',
          headers: { "Content-Type": 'application/x-www-form-urlencoded' },
          transformResponse : function(data) {
            // string -> XML document object
            return xmlToJson($.parseXML(data));
          }
        }).success(function(data, status, headers, config) {
          console.log(data);  // XML document object
          //$scope.xml = data.documentElement.innerHTML;
        }).error(function(data, status, headers, config) {
          console.log('FAILED');
          console.log(status);
        });
      },
      getVolume: function(device) {
        $http({
          method  : 'GET',
          url     : 'http://' + device.hostName + ':' + device.port+ '/volume',
          timeout : 10000,
          headers: { "Content-Type": 'application/x-www-form-urlencoded' },
          transformResponse : function(data) {
            // string -> XML document object
            return xmlToJson($.parseXML(data));
          }
        }).success(function(data, status, headers, config) {
          console.log(data);  // XML document object
          device.volume = data.volume.actualvolume['#text'] * 1;
          //$scope.xml = data.documentElement.innerHTML;
        }).error(function(data, status, headers, config) {
          console.log('FAILED');
          console.log(data);
        });
      }
    };
  });
