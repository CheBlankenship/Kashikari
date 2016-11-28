var app = angular.module('kashikari', ['ui.router']);


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

app.controller('ProductController', function($scope, API, $stateParams, $state) {
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

app.controller('LoginController', function($scope, API, $state) {
  console.log('In the login');
  $scope.loginSubmit = function() {
    console.log("click loginSubmit()");
    var login_data = {
      username : $scope.username,
      password : $scope.password
    };
    console.log(login_data);
    API.login(login_data)
      .success(function(login_data) {
        console.log('success side');
        console.log("Finally success!!", user_info);
      }).error(function() {
        console.log("couldn't login...");
    });
  };

});


app.factory('API', function($http, $state){
  var service = {};

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

// hennkou kakuninn

  service.login = function(login_data, $scope) {
    // var loginData = $cookies.getObject('loginData');
    var url = 'api/user/login';
    return $http({
      url : url,
      method: 'POST',
      username: login_data.username,
      password: login_data.password
    }).success(function(data) {
      service.authToken = data.auth_token;
      $scope.user = data.user;
      // $cookies.putObject('Login success(service)', data);
      console.log('Login success(service)', data);
    });
  };

  return service;
});
