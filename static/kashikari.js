var app = angular.module('kashikari', ['ui.router','ngCookies']);


app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state({
      name: 'home',
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })
    .state({
      name: 'product',
      url: '/product/{id}',
      templateUrl: 'templates/product.html',
      controller: 'ProductController'
    })
    .state({
      name: 'signup',
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupController'
    })
    .state({
      name: 'login',
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    });

  $urlRouterProvider.otherwise('/');
});

app.controller('HomeController', function($scope, API) {
  API.getProducts().success(function(products) {
    $scope.products = products;
    console.log("check if the update is catching up");
    console.log(products);
    // console.log("check if im in here");
  });
});

app.controller('ProductController', function($scope, API, $stateParams, $state, $cookies, $rootScope) {
  API.getProduct($stateParams.id)
    .success(function(product){
      $scope.product = product;
      console.log($scope.product);
      console.log("check if im in the product zone");
      $state.go('/');
    });
});

app.controller('SignupController', function($scope, API, $stateParams, $state) {
  $scope.signupSubmit = function() {
    console.log("check if the function is working");
    if($scope.password != $scope.confirmPassword){
      $scope.formError = true;
      $scope.errorMessage = "Password doesn't match";
    }
    else{
      $scope.formError = false;
      var signup_data = {
        username: $scope.username,
        email: $scope.email,
        password: $scope.password,
        first_name: $scope.firstName,
        last_name: $scope.lastName
      };
      API.signup(signup_data)
      .success(function() {
        $state.go('home');
      }).error(function() {
        console.log("signup faild.");
      });
    }
  };
});

app.controller('LoginController', function(API, $cookies,$rootScope, $scope, $state) {
  $scope.loginSubmit = function() {
    var login_data = {
      username : $scope.username,
      password : $scope.password
    };
    API.login(login_data).success(function(user_info) {
        $cookies.putObject('cookie_data', user_info);
        console.log('Got into success statment');
        // $rootScope.displayName = user_info.username;
        // $rootScope.auth_token = user_info.auth_token;
        $state.go('home');
      }).error(function() {
        console.log('failed');
        console.log(login_data);
    });
  };

});


app.factory('API', function($http, $state, $rootScope, $cookies){
  var service = {};

  // $rootScope.cookie_data;


  if(!$cookies.getObject('cookie_data')){
    $rootScope.displayName = null;
    $rootScope.loggedIn = false;
  }
  else{
    var cookie = $cookies.getObject('cookie_data');
    $rootScope.displayName = cookie.username;
    $rootScope.auth_token = cookie.auth_token;
  }

// logout をするときにcookie　に保存されているデータを全て削除する
  $rootScope.logout = function() {
    console.log('Im going to delete user info');
    $cookies.remove('cookie_data');
    $rootScope.displayName = null;
    $rootScope.auth_token = null;
    $rootScope.loggedIn = false;
    console.log("check if its here 3");
    $state.go('home');
  };




  service.getProducts = function() {
    // return $http.get('/api/products');
    var url = '/api/products';
    return $http({
      method: 'GET',
      url: url
    });
  };

  service.getProduct = function(id) {
    return $http.get('/api/product/' + id);
  };

  service.signup = function(signup_data) {
    var url = '/api/user/signup';
    return $http({
      method: 'POST',
      url: url,
      data: signup_data
    });
  };


  service.login = function(login_data) {
    var url = 'api/user/login';
    return $http({
      url : url,
      method: 'POST',
      data: login_data
    });
  };

  return service;
});
