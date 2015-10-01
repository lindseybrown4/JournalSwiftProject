var app = angular.module('MyApp')

app.controller('storyCtrl', function(storyService, socketio, $scope) {

	var vm = this;

	vm.createStory = function() {
		vm.message = '';
		storyService.create(vm.storyData)
			.success(function(data) {
				vm.message = data.message;
			});
	};

	$scope.journalEntry = function() {
		$scope.story = true;
	}
	$scope.date = new Date();

})