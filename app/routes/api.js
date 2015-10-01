var userService = require('../models/user');
var storyService = require('../models/story');
var config = require('../../config'); 

var secretKey = config.secretKey; 

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

	var token = jsonwebtoken.sign({
		_id: user._id, 
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresInMinute: 1440
	});

	return token;
}

module.exports = function(app, express, io) {

	
	var api = express.Router(); 

	api.post('/signup', function(req, res) {

		var user = new userService({
			name: req.body.name, 
			username: req.body.username,
			password: req.body.password
		});

		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 

				success: true,
				message: 'userService had been created!',
				token: token

			});
		});
	});

	api.get('/users', function(req, res) {

		userService.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(users);
		});
	});

	api.post('/login', function(req, res) {

		userService.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {
				res.send({ message: "userService doesn't exist"});
			} else if(user) {

				var validPassword = user.comparePassword(req.body.password);
				
				if(!validPassword) {
					res.send({ message: "Invalid Password" });
				} else {

					var token = createToken(user);

					res.json({
						success: true, 
						message: "Successful login!",
						token: token
					});
				}
			}
		});
	});

	api.delete('/deleteJournalEntry/:id', function(req, res) {
		
		storyService.findByIdAndRemove(req.params.id, 

		function(err, result) {
		
			    if(!err) {
						res.status(200).json(result); 
					} else {
						res.status(500).json(err);
					}
		});

	});

	api.use(function(req, res, next) {

		console.log("Somebody just came to our app!"); 

		var token = req.body.token || req.params.token || req.headers['x-access-token']; 

		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user" });
				} else {
					
					req.decoded = decoded; 
					next(); 
				}
			});

		} else {
			res.status(403).send({success: false, message: "No Token Provided" });
		}
	}); 


api.route('/')

	.post(function(req, res) {
			var story = new storyService({
				creator: req.decoded._id,
				content: req.body.content
			}); 

			story.save(function(err, newStory) {
				if(err) {
					res.send(err); 
					return
				} 

				userService.findOne({_id: req.decoded._id}).exec(function(err, user) {
					console.log(err)
					console.log(user)
					if(err)  {
					res.send(err); 
					return
				} user.storyIds.push(story._id)
					user.save(function(err, savedUser) {
						if(err)  {
						res.send(err); 
						return
						}  

						io.emit('story', newStory)
				res.json({message: "New storyService Created!"}); 
				})

				})

			});	
	})

	.get(function(req, res) {
		
		storyService.find({ creator: req.decoded._id }, function(err, stories) {

			if(err) {

				res.send(err)
				return;
			}
	
			res.json(stories);
		});
	})

	.put(function(req, res) {

		storyService.findByIdAndUpdate(req.body._id, {content: req.body.edits},

		function (err, result) {
				if(!err) {
					res.status(200).json(result); 
				} else {
					res.status(500).json(err);
				}
		});
	
	});

	api.get('/me', function(req, res) {
		res.json(req.decoded); 

	}); 

return api

}
