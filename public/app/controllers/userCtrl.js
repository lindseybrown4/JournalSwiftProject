var app = angular.module('MyApp')
app.controller('userCtrl', function(userService) {

	var vm = this; 

	userService.all()
		.success(function(data) {
			vm.users = data;
		})
})

app.controller('UserCreateController', function(userService, $location, $window, authService) {

	var ucc = this; 

	ucc.signupUser = function() {
		ucc.message = ''; 
		var userData = ucc.userData
		userService.create(ucc.userData)
			.then(function(response) {
				ucc.userData = {};
				ucc.message = response.data.message;

				$window.localStorage.setItem('token', response.data.token);
				
			})
			.then(function(){
				authService.login(userData.username, userData.password)
			})
			.then(function(){
				$location.path('/homeuser');
			})
	}
})