var app = angular.module('MyApp')

app.controller('pastEntriesCtrl', function(storyService, socketio, $scope) {

	var vm = this;

	storyService.allStory()
		.success(function(data) {
			vm.stories = data;
		});

	$scope.editing = false; 

	$scope.toggleEditing = function(index) {
	
		$scope.editing = !$scope.editing;
	}

   	$scope.editEntry = function(index, newContent) {

   		$scope.storyEdit = {}; 

   		$scope.storyEdit._id = vm.stories[index]._id;

   		$scope.storyEdit.edits = newContent;

   		storyService.editStory($scope.storyEdit).then(function(res) {
   			
   		});
   	}

   	$scope.deleteEntry = function(index) {

   		$scope.storyId = vm.stories[index]._id

   		storyService.removeEntry($scope.storyId).then(function(res) {
   		
   		})
   	}

	socketio.on('story', function(data) {
		vm.stories.push(data);
	})

});