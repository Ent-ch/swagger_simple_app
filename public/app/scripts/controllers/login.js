app.controller('LoginCtrl', function($scope, $alert, $auth, $state) {
    $scope.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {

          $alert({
            content: 'You have successfully logged in',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(){
          $alert({
            content: 'You have successfully logged in',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
          $state.go('profile');
        })
        .catch(function(response) {
          $alert({
            content: response.data,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };
  });