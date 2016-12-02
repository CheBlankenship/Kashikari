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
      var formData = {
        username: $scope.username,
        email: $scope.email,
        password: $scope.password,
        first_name: $scope.firstName,
        last_name: $scope.lastName
      };
      API.signup(formData)
      .success(function() {
        $state.go('home');
      }).error(function() {
        console.log("signup faild.");
      });
    }
  };
});

app.controller('LoginController', function($scope, API, $state, $cookies) {

  console.log('In the login');
  $scope.loginSubmit = function() {
    console.log("click loginSubmit()");
    var login_data = {
      username : $scope.username,
      password : $scope.password
    };
    $scope.login_data = login_data;
    console.log(login_data);
    API.login(login_data)
      .success(function(user_info) {
        console.log('success side');
        console.log("Finally success!!", user_info);
        console.log(user_info.user_name);
        $state.go('home');
      }).error(function() {
        console.log("couldn't login...");
        console.log(login_data);
    });
  };

});


app.factory('API', function($http, $state, $rootScope, $cookies){
  var service = {};
  // var loginData = $cookies.getObject('loginData');
  $rootScope.showUserName = false;

  // Set cookie data to username or guest GLOBAL VALUES!
  // もし cookie_data でない場合、データをなしにしておく
  if(!$cookies.getObject('cookie_data')){
    $rootScope.displayName = null;
    // $rootScope.loggedIn = false;
  }
  // cookie を定義し、それに$rootScope を使って　グローバルバリューにする。他の範囲で使用可能にする。
  else{
    var cookie = $cookies.getObject('cookie_data');
    $rootScope.displayName = cookie.username;
    $rootScope.auth_token = cookie.auth_token;
    $rootScope.loggedIn = true;
    $rootScope.showUserName = true;
  }

// logout をするときにcookie　に保存されているデータを全て削除する
  $rootScope.logout = function() {
    console.log('Im going to delete user info');
    $cookies.remove('cookie_data');
    $rootScope.displayName = null;
    $rootScope.auth_token = null;
    $rootScope.loggedIn = false;
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

  service.signup = function(formData) {
    var url = '/api/user/signup';
    return $http({
      method: 'POST',
      url: url,
      data: formData
    });
  };


  service.login = function(data) {
    var url = 'api/user/login';
    return $http({
      url : url,
      method: 'POST',
      data: data
    }).success(function(data) {
      service.auth_token = data.auth_token;
      $rootScope.user = data.user;
      console.log('Login success (service)', data);
    });
  };



  return service;
});
