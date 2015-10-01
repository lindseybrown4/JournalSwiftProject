var app = angular.module('MyApp', ['ngRoute'])

app.config(function($httpProvider, $routeProvider, $locationProvider) {
	
	$httpProvider.interceptors.push('AuthInterceptor');

	$routeProvider

	.when('/', {

		templateUrl: 'app/views/pages/home.html',
		controller: 'mainCtrl'
	})

	.when('/homeuser', {

		templateUrl: 'app/views/pages/homeuser.html',
		controller: 'storyCtrl',
		controllerAs: 'vm'
	})

	.when('/pastEntries', {
		templateUrl: 'app/views/pages/pastEntries.html',
		controller: 'pastEntriesCtrl',
		controllerAs: 'vm'
       
	})

	.when('/login', {
		templateUrl: 'app/views/pages/login.html',
		controller: 'mainCtrl'
	})

	.when('/signup', {
		templateUrl: 'app/views/pages/signup.html',
		controller: 'UserCreateController',
		controllerAs: 'ucc'
	})

	.when('/about', {
		templateUrl: 'app/views/pages/about.html',
	})

	$locationProvider.html5Mode(true);
}) 
