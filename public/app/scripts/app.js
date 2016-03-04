/* global angular */
var app = angular.module('hubChat', [ 
  'ui.router', 
  'satellizer', 
  'mgcrea.ngStrap',
  'pubnub.angular.service',
  'ngMessages',
  'ngAnimate'
]);

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          authenticated: ['$location', '$auth', function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/login');
            }
          }]
        }
      });

    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '728815717261973'
    });

    $authProvider.linkedin({
      clientId: '77o23y7ne4raof'
    });

    $authProvider.unlinkUrl = '/profile/unlink/'
    
    $authProvider.google({
      clientId: '71630315039-52iq2p0bqgt22l2sg4oku9on1ju8jvtq.apps.googleusercontent.com'
    });
  });