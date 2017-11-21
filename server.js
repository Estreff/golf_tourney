const express = require('express');
const app = express();
const mongo = require('mongojs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cheerio = require('cheerio');
const request = require('request');
const logger = require('morgan')
const axios = require('axios');
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
const models = require('./models'); 

const databaseUri = 'mongodb://localhost/majors';

if(process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(databaseUri);
}

const db = mongoose.connection;

db.on('error', (err) => console.log('Mongoose Error: ', err));
db.once('open', () => console.log('Mogoose Connection Successful!!'));

mongoose.Promise = Promise;
mongoose.set('debug', true);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.redirect('/PGAleaderboard');
});

app.get('/owgr', function(req, res) {
	models.OWGR
    .find({})
    .then(function(rank) {
		
		// If we were able to successfully find Articles, send them back to the client
        var hbsObject = {
            owgr: rank
        };        
        res.render('owgr', hbsObject);
    })
    .catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
    });
});

app.get("/owgr/update", function(req, res) {
	models.OWGR.remove(function(err,removed) {
		
		   // where removed is the count of removed documents
		});
	// First, we grab the body of the html with request
	axios.get("http://www.owgr.com/ranking?pageNo=1&pageSize=500&country=All").then(function(response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);
		
	  $('div.table_container tbody tr').each(function(i, element) {
		  var rankings = {};
		  
		  rankings.currentRank = $(this).find('td:nth-child(1)').text().trim();
		  rankings.lastWeekRank = $(this).find('td:nth-child(2)').text().trim();
			rankings.country = $(this).find('td.ctry').children().attr('title').trim();
			rankings.name = $(this).find('td.name').text().trim();
			rankings.events = $(this).find('td:nth-child(11)').text().trim();
			
			
		// Create a new Article using the `result` object built from scraping
		models.OWGR
		.create(rankings)
		.then(function(dbRank) {
			// If we were able to successfully scrape and save an Article, send a message to the client
			res.redirect("/owgr");
		})
		.catch(function(err) {
			// If an error occurred, send it to the client
			res.json(err);
		});
	});
	});
});


app.get('/PGAleaderboard', (req, res) => {
	models.Scorecard.find({}, (err, posts) => {
		//  res.json(posts));
        var hbsObject = {
			golfers: posts
        };
        
		res.render('index', hbsObject);
    });
});

app.get('/PGAleaderboard/update', (req, res) => {
    models.Scorecard.remove(function(err,removed) {
		
		   // where removed is the count of removed documents
		});
	axios.get("http://www.golfchannel.com/tours/pga-tour").then(function(response) {
		
		var $ = cheerio.load(response.data);

        
		$('tr.playerRow').each(function(i, element) {
			
                        var golferScrape = $(element).find('a.pName').text().trim().replace(' *', '').split(', ');
                        var firstName = golferScrape[1];
                        var lastName = golferScrape[0];
                        var golfer = `${firstName} ${lastName}`
                        var position = $(element).find('td:nth-child(2)').text().trim();
                        var overall = $(element).find('td:nth-child(5)').text().trim();
                        var teeTime = $(element).find('td:nth-child(6)').attr('colspan');
						console.log('Tee Time: ', teeTime);
                        var thru = $(element).find('td:nth-child(6)').text().trim();
                        var currentRound = $(element).find('td:nth-child(7)').text().trim();
                        var R1 = $(element).find('td:nth-child(8)').text().trim();
                        var R2 = $(element).find('td:nth-child(9)').text().trim();
                        var R3 = $(element).find('td:nth-child(10)').text().trim();
                        var R4 = $(element).find('td:nth-child(11)').text().trim();
                        var total = $(element).find('td:nth-child(12)').text().trim();
            
                        var data = {
                                golfer: golfer,
                                position: position,
                                overall: overall,
                                teeTime: teeTime,
                                thru: thru,
                                currentRound: currentRound,
                                round1: R1,
                                round2: R2,
                                round3: R3,
                                round4: R4,
                                total: total
                            };
                
							console.log(JSON.stringify(data, null, 2));
							models.Scorecard.create(data)
			.then(function(dbScorecard) {
				
				res.redirect('/PGAleaderboard');
				});
			})
			.catch(function(err) {
				// If an error occurred, send it to the client
				res.json(err);
			});
        });	
	});
	
	
    app.get('/teamCreate', (req, res) => {
		models.OWGR.find({}, (err, posts) => {
            //  res.json(posts));
            var hbsObject = {
				golfers: posts,
            };    
            res.render('teamCreate', hbsObject);    
        });
		
    });
	
    app.get('/team', (req, res) => {
		models.Entry.find({}, (err, team) => {
			//  res.json(posts));
            var hbsObject = {
				golfers: team,
			};    
			console.log(hbsObject);
            res.render('teams', hbsObject);    
        });        
	});
	
	
    app.post('/team/new', (req, res) => {
        var team = {
			golfer1: req.body.golfer1,
            golfer2: req.body.golfer2,
            golfer3: req.body.golfer3,
            golfer4: req.body.golfer4,
            golfer5: req.body.golfer5,
            golfer6: req.body.golfer6,
        }
		
		models.Entry.create(team)
		.then(function(dbEntry) {
			res.redirect('/team');     
		});
		
    });
	
	app.get('/*', (req, res) => {
		res.redirect('/PGAleaderboard');
	});
    
	app.listen(PORT, () => {
		console.log('App listening on PORT ' + PORT);
	});