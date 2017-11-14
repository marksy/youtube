const app_yt = angular.module('app_yt');

app_yt.controller('ListController', ['$scope', '$rootScope', '$log', '$http', '$state', '$timeout', function($scope, $rootScope, $log, $http, $state, $timeout) {

  const vm = this;
  vm.viewingDetail = false;
  vm.hideList = false;

  vm.viewDetail = function (index) {
    $rootScope.$broadcast('dataReady');
    $state.go('list.detail', {
      video: index
    });
    vm.viewingDetail = true;
    $timeout(function () {
      vm.hideList = true;
    },500);
  };

  $http({
    method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&maxResults=10&playlistId=PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ&key=AIzaSyCuv_16onZRx3qHDStC-FUp__A6si-fStw'
  }).then(function successCallback(response) {
      $rootScope.$broadcast('dataReady');
      vm.videoList = response.data.items;
      console.log('vm.videoList',vm.videoList);
    }, function errorCallback(response) {
      console.log('error:', response);
    });

}]);
