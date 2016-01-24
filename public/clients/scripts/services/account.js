app.factory('Account', function($http, $auth) {
    return {
      getProfile: function() {
        return $http.get('/profile');
      },
      updateProfile: function(profileData) {
        return $http.put('/profile', profileData);
      }
    };
});