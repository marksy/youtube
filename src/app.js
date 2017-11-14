(function(){
	'use strict';

	const angular = require('angular');
	const uiRouter = require('angular-ui-router');

	const app_yt = angular.module('app_yt', ['ui.router']);
	const ListController = require('./js/controllers/ListController.js');
	const DetailController = require('./js/controllers/DetailController.js');


	app_yt.config(function($stateProvider, $urlRouterProvider, $compileProvider,$locationProvider) {

		// $compileProvider.debugInfoEnabled(false);
		// $locationProvider.html5Mode(true);

	    $urlRouterProvider.otherwise('/');

	    $stateProvider
			.state('list', {
	      url: '/',
				controller: 'ListController as vm',
	      templateUrl: 'assets/views/list.html'
	    })
			.state('list.detail', {
        url: 'detail/:video',
				controller: 'DetailController as vm',
				templateUrl: 'assets/views/detail.html'
      });
	});

	app_yt.config(function($sceDelegateProvider) {
	  $sceDelegateProvider.resourceUrlWhitelist([
	    'self',
	    'https://www.youtube.com/**'
	  ]);
	});

})();
