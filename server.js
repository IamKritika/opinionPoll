// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://localhost:27017/opinionfr-dev');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
	
	 // define model =================
    var Todo = mongoose.model('Todo', {
		questionnaireID : Number,
		questionnaireTitle: String,
       qa : []
		
    });
	
	 var Answer = mongoose.model('Answer', {
        userID :Number,
		ans : []
    });
	
	// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
console.log(req.body.qa);
console.log(req.body.questionnaireID);
        // create a todo, information comes from AJAX request from Angular
        Todo.create({
			questionnaireID : req.body.questionnaireID,
			questionnaireTitle:req.body.questionnaireTitle,
           qa :req.body.qa
			
			}, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });
	 app.post('/api/ans', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Answer.create({
            userID : req.body.userID,
			ans :req.body.ans
			}, function(err, answer) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Answer.find(function(err, answers) {
                if (err)
                    res.send(err)
                res.json(answers);
            });
        });

    });

   
	
	 // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	
	

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");