const app_yt = angular.module('app_yt');

app_yt.controller('DetailController', ['$scope', '$stateParams', '$state', '$timeout', function($scope, $stateParams, $state, $timeout) {

  const vm = this;
  let param = parseInt($stateParams.video, 10);
  let listLength;

  function initVideo () {
    vm.video = $scope.$parent.vm.videoList[param].snippet;
    vm.video.url = 'https://www.youtube.com/embed/' + vm.video.resourceId.videoId;
    initPagination();
  }

  function initPagination () {
    listLength = $scope.$parent.vm.videoList.length - 1;
    if (param < listLength) {
      vm.showNext = true;
    }
    if (param <= listLength && param > 0) {
      vm.showPrev = true;
    }
  }

  vm.next = () => {
    $state.go('list.detail', {
      video: param + 1
    });
  };

  vm.prev = () => {
    $state.go('list.detail', {
      video: param - 1
    });
  };

  // if data is already loaded
  if (!!$scope.$parent.vm.videoList) {
    initVideo();
  } else {
    // else wait for data to be loaded
    $scope.$on('dataReady', function () {
      $timeout(() => {
        initVideo();
      }, 0);
    });
  }


  $scope.$parent.vm.viewingDetail = true;

  vm.close = () => {
    $state.go('list');
    $scope.$parent.vm.viewingDetail = false;
    $scope.$parent.vm.hideList = false;
  };


}]);
