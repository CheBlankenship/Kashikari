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
    });
  $urlRouterProvider.otherwise('/');
});

app.controller('HomeController', function($scope, API) {
  API.getProducts()
    .success(function(products) {
      $scope.products = products;
      console.log(products);
    });
});

app.controller('ProductController', function($scope, API, $stateParams, $state) {
  API.getProduct($stateParams.id)
    .success(function(product){
      $scope.product = product;
      console.log($scope.product);
    });
});

app.controller('SignupController', function($scope, API, $stateParams, $state) {
  $scope.signupSubmit = function() {
    if($scope.password != $scope.confirmPassword){
      $scope.formError = true;
      $scope.errorMessage = "Password doesn't mach";
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
        $state.go('login');
      });
    }
  };
});


app.factory('API', function($http){
  var service = {};

  service.getProducts = function() {
    return $http.get('/api/products');
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

  return service;
});
