var app = angular.module('MyApp')

app.factory('storyService', function($http) {

	var storyFactory = {}

	storyFactory.create = function(storyData) {
		return $http.post('/api', storyData);
	
	}

	storyFactory.allStory = function() {
		return $http.get('/api');

	}

	storyFactory.editStory = function(storyObj) {
		return $http.put('/api', storyObj);
	}

	storyFactory.removeEntry = function(storyId) {

		return $http.delete('/api/deleteJournalEntry/' + storyId); 
	}

	return storyFactory; 
})

.factory('socketio', function($rootScope) {
	

	var socket = io.connect(); 
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments; 
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		}, 
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var ars = arguments; 
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});