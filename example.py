app.controller("LoginController", function($scope, StoreService, $stateParams, $state, $cookies, $rootScope) {
  $rootScope.noSplash = false;
  $scope.login = function() {
    var formData = {
      username: $scope.username,
      password: $scope.password
    };
    StoreService.login(formData)
      .error(function(){
        $scope.wronglogin = true;
      })
      .success(function(login_data) {
        $cookies.putObject('cookie_data', login_data);
        $state.go('home');
      });
  };
});

app.factory('StoreService', function($http, $state, $cookies, $rootScope) {
var service = {};
// set cookie data to username or guest
if (!$cookies.getObject('cookie_data')) {
  $rootScope.displayName = null;
  $rootScope.loggedIn = false;
}
else {
  var cookie = $cookies.getObject('cookie_data');
  $rootScope.displayName = cookie.username;
  $rootScope.auth_token = cookie.auth_token;
  $rootScope.loggedIn = true;
}





service.login = function(formData) {
    var url = '/api/user/login';
    return $http({
      method: 'POST',
      url: url,
      data: formData
    }).success(function(login_data) {
      $cookies.putObject('cookie_data', login_data);
      $rootScope.displayName = login_data.username;
      $rootScope.auth_token = login_data.auth_token;
      $rootScope.loggedIn = true;
    });
  };
