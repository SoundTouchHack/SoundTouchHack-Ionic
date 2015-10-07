// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'soundtouch' is the name of this angular module example (also set in a <body> attribute in index.html)
angular.module('soundtouch', [
  'ionic',
  'SoundTouchHack.controller.DiscoveryController',
  'SoundTouchHack.controller.SoundTouchController'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

    // Each tab has its own nav history stack:

    .state('tab.soundtouch', {
      url: '/soundtouch',
      views: {
        'tab-soundtouch': {
          templateUrl: 'templates/tab-soundtouch.html',
          controller: 'SoundtouchController'
        }
      }
    })

    .state('tab.discovery', {
      url: '/discovery',
      views: {
        'tab-discovery': {
          templateUrl: 'templates/tab-discovery.html',
          controller: 'DiscoveryController'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/soundtouch');

});
