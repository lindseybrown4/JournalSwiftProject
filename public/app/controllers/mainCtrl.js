var app = angular.module('MyApp')
app.controller('mainCtrl', function($rootScope, $location, authService, $scope) {

	$scope.loggedIn = authService.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function() {

		$scope.loggedIn = authService.isLoggedIn(); 
		authService.getUser()
			.then(function(data) {
				$scope.user = data.data;
			});
	});

	$scope.doLogin = function() {

		$scope.processing = true; 

		$scope.error = ''; 

	authService.login($scope.loginData.username, $scope.loginData.password)
		.success(function(data) {
			$scope.processing = false;

				authService.getUser()
					.then(function(data) {
						$scope.user = data.data;
					});

					if(data.success)
						$location.path('/homeuser');
					else
						$scope.error = data.message;
		});
	}

	$scope.doLogout = function() {
		authService.logout(); 
		$location.path('/');
	}
});












