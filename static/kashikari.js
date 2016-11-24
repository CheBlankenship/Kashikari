var app = angular.module('kashikari', ['ui.router']);


app.factory('$productSearch', function($http){
  var service = {};

  service.productListCall = function() {
    var url = 'http://localhost:5000/api/products';
    return $http({
      method: 'GET',
      url: url
    });
  };

  // service.productListCall = function() {
  //   var url = 'http://localhost:5000/api/products/' + query;
  //
  // }

  return service;
});






app.controller('ProductListController', function($scope, $productSearch, $stateParams, $state) {

  $productSearch.productListCall().success(function(products) {
    $scope.products = products;
  });


});










app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state({
    name: 'home',
    url: '/',
    templateUrl: 'home.html',
    controller: 'ProductListController'
  });



  $urlRouterProvider.otherwise('/');
});
