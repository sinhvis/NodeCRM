// BASE SETUP
// ==========================

// CALL THE PACKAGES---------
var express	= require('express') ; // call express
var app		= express() ; // define our app using express
var bodyParser	= require('body-parser') ; // get body-parser
var morgan	= require('morgan') ; // used to see requests
var mongoose	= require('mongoose') // for working with our database
var port	= process.env.PORT || 8080 ; // set the port for our app


// connect to our database
mongoose.connect('mongodb://localhost:27017/myDatabase') ;

var User = require('./app/models/user') ;

// APP CONFIGURATION
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true })) ;
app.use(bodyParser.json()) ;

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*') ;
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST') ;
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
	Authorization') ;
	next() ;
}) ;

// log all requests to the console
app.use(morgan('dev')) ;

// ROUTES FOR OUR API
// ===================================

// basic route for the home page
app.get('/', function(req, res) {
	res.send('Welcome to the home page!') ;
}) ;

// get an instance of the express router
var apiRouter = express.Router() ;


// more routes for our API will happen there

// middleware to use for all requests
apiRouter.use(function(req, res, next) {
	// do logging
	console.log('Somebody just came to our app!') ;
	
	// We'll add more to this middleware later
	// this is where we will authenticate users

	next() ; // make sure we go to the next routes and don't stop here.
}) ;

// test route to make sure everything is working
// (accessed at GET http://localhost:8080/api)
// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api! '}) ;
}) ;

// route middleware and first route are here
// Make sure that this route is supposed to be here
// Remove above comment if this is the correct place.

// on routes that end in /users
// --------------------------------------------------------------
apiRouter.route('/users')

	// create a user (accessed at POST http://localhost:8080/api/users
	.post(function(req, res) {
		// create a new instance of the User model
		var user = new User() ;

		// set the users information (comes from the request)
		user.name = req.body.name ;
		user.username = req.body.username ;
		user.password = req.body.password ;

		// save the user and check for errors
		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
					return res.json({ success: false, messae: 'A user with that username already exists. ' }) ;
				else
					return res.send(err) ;
			}
			res.json({ message: 'User created!' }) ;
		}) ;
	}) 

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', apiRouter) ;

// START THE SERVER
// =============================================
app.listen(port) ;
console.log('Magic happens on port ' + port) ;
