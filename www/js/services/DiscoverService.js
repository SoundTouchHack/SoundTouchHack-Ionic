angular.module('SoundTouchHack.service.DiscoverService', [])

.factory('DiscoverService', function() {

  var factory = {};
  factory.devices = [];

  function getDevicesForAndroid(devices, error) {
    console.log('Searching using ZeroConf (android)');

    // use '_soundtouch._tcp.local.' to find soundtouch, use '_http._tcp.local.' to find all
    ZeroConf.list('_soundtouch._tcp.local.', 2000,
      function (result) {
        console.log('ZeroConf success: ' + JSON.stringify(result));
          if (typeof result !== 'undefined') {
            var deviceArray = result.service;
            if (typeof deviceArray !== "undefined") {
              for (var i = 0; i < deviceArray.length; i++) {
                var device = deviceArray[i];
                var url = device.urls[0].replace('http://', '').split(':');

                factory.devices.push({
                  serviceName: device.name,
                  hostName: url[0],
                  port: url[1],
                  platform: 'ANDROID'
                });
                devices(factory.devices);
              }
            }
          }
      },
      function (errorMessage) {
        error(errorMessage);
      }
    );
  }

  function getDevicesForIOS(devices, error) {
    console.log('Searching using Bonjour (IOS)');

    if (window.plugins == undefined) {
      error("Clould not find Bonjour DNS Library");
      return
    }

    // "_soundtouch._tcp"
    window.plugins.dnssd.browse("_soundtouch._tcp", "local", function (serviceName, regType, domain, moreComing) {
      //add new device to list
      factory.devices.push({
        serviceName: serviceName,
        regType: regType,
        domain: domain,
        moreComing: moreComing,
        platform: 'IOS'
      });
      //return device list
      devices(factory.devices);
    }, function (serviceName, regType, domain, moreComing) {
      //remove device from list
      angular.forEach(factory.devices, function (obj, index) {
        if (obj.serviceName === serviceName) {
          // remove the matching item from the array
          factory.devices.splice(index, 1);
        }
      });
      //return devices list
      devices(factory.devices);
    });
  }

  factory.getSoundTouchDevices = function(devices, error) {
    factory.devices = [];
    if (ionic.Platform.isAndroid()) {
      getDevicesForAndroid(devices, error);
    } else if (ionic.Platform.isIOS()) {
      getDevicesForIOS(devices, error)
    } else {
      alert('Your mobile platform is not supported by the soundtouch app');
    }
  };

  factory.getSoundTouchDetail = function(device, resolveCallback) {
    if(ionic.Platform.isIOS()) {
      console.log('Detail for Android');
      window.plugins.dnssd.resolve(device.serviceName, device.regType, device.domain,
        function (hostName, port, serviceName, regType, domain) {
          device = {
            serviceName: serviceName,
            hostName: hostName,
            port: port
          };
          resolveCallback(device);
        });
    } else if(ionic.Platform.isAndroid()) {
      console.log('Detail for Android');
      resolveCallback(device);
    }
  };

  return factory;

});
