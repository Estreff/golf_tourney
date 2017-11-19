const express = require('express');
var mongojs = require('mongojs');
var request = require('request');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var axios = require("axios");
var logger = require('morgan')


const app = express();
const PORT = process.env.PORT || 8080;

var db = mongojs('majors', ['owgrs', 'scorecard']);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));



app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

var db = require('./models'); 
require("./routes/api-routes.js")(app);

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/majors", {
  useMongoClient: true
});

var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Database Error:', err);
});

app.get('/', function(req, res) {
	
	// Make a request call to grab the HTML body from the site of your choice
	request("http://www.golfchannel.com/tours/pga-tour", function(error, response, html) {
		
		// Load the HTML into cheerio and save it to a variable
		// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		var $ = cheerio.load(html);
		
		// An empty array to save the data that we'll scrape
		var results = [];
		
		$('tr.playerRow').each(function(i, element) {
			
			var golfer = $(element).find('a.pName').text().trim();
			var position = $(element).find('td:nth-child(2)').text().trim();
			var overall = $(element).find('td:nth-child(5)').text().trim();
			var thru = $(element).find('td:nth-child(6)').text().trim();
			var currentRound = $(element).find('td:nth-child(7)').text().trim();
			var R1 = $(element).find('td:nth-child(8)').text().trim();
			var R2 = $(element).find('td:nth-child(9)').text().trim();
			var R3 = $(element).find('td:nth-child(10)').text().trim();
			var R4 = $(element).find('td:nth-child(11)').text().trim();
			var total = $(element).find('td:nth-child(12)').text().trim();

			var scorecard = new Scorecard ({
				golfer: golfer,
				position: position,
				overall: overall,
				thru: thru,
				currentRound: currentRound,
				round1: R1,
				round2: R2,
				round3: R3,
				round4: R4,
				total: total
			});

			db.scorecards.insert({
				golfer: golfer,
				position: position,
				overall: overall,
				thru: thru,
				currentRound: currentRound,
				round1: R1,
				round2: R2,
				round3: R3,
				round4: R4,
				total: total
			});	
		});	
	});
});




app.listen(PORT, function() {
	console.log('App listening on PORT ' + PORT);
});
