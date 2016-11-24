var app = angular.module('kashikari', ['ui.router']);


app.factory('Kashikari', function($http){
  var service = {};

  service.nowPlaying = function() {
    var url = 'http://localhost:5000/api/products';
    return $http({
      method: 'GET',
      url: url
    });
  };

  return service;
});






app.controller('showPackagesController', function($scope, $productSearch, $stateParams, $state) {

  $productSearch.nowPLaying().success(function() {
    $scope.products = products;
    console.log(products);
  });


});










app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state({
    name: 'home',
    url: '/',
    templateUrl: 'home.html',
    controller: 'showPackagesController'
  });
  $urlRouterProvider.otherwise('/');
});
