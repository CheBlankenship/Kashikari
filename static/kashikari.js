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
      console.log(product);
    });
});


app.factory('API', function($http){
  var service = {};

  service.getProducts = function() {
    return $http.get('/api/products');
  };

  service.getProduct = function(id) {
    return $http.get('/api/product/' + id);
  };

  return service;
});
