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
	.sort('currentRank')
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


app.get('/PGAleaderboard', function(req, res) {
	models.Scorecard
	.find({})
	.sort('positionCalc')
    .then(function(leaderboard) {
		
        var hbsObject = {
			golfers: leaderboard
        };
        
        res.render('index', hbsObject);
    })
    .catch(function(err) {

		res.json(err);
    });
});

app.get('/PGAleaderboard/update', (req, res) => {
    models.Scorecard.remove(function(err,removed) {
		
		   // where removed is the count of removed documents
		});
	axios.get("http://www.golfchannel.com/tours/pga-tour").then(function(response) {
		
		var $ = cheerio.load(response.data);

        
		$('tr.playerRow').each(function(i, element) {
			
			var golferScrape = $(element).find('a.pName').text().trim().replace(' *', '').replace(' (a)', '').split(', ');
			var firstName = golferScrape[1];
			var lastName = golferScrape[0];
			var golfer = `${firstName} ${lastName}`
			var position = $(element).find('td:nth-child(2)').text().trim();
			var positionCalc = $(element).find('td:nth-child(2)').text().trim().replace('CUT', 999).replace('WD', 999).replace('T', '');
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
					total: total,
					positionCalc: positionCalc
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
		models.OWGR
		.find({})
		.sort('currentRank')
		.then(function(posts) {
            //  res.json(posts));
            var hbsObject = {
				golfers: posts,
            };    
            res.render('teamCreate', hbsObject);    
		})
		.catch(function(err) {			
			res.json(err);
		});
		
    });
	
    app.get('/team', (req, res) => {
		models.Entry.find({}, (err, team) => {
			console.log(JSON.stringify(team, null, "\t"));
						
			var hbsObject = {
				golfers: team,
			};    
			// console.log(hbsObject);
			res.render('teams', hbsObject);    
		});  
	});

	app.post('/team/update', (req, res) => {
		var entryID = req.body.entryID;
		console.log('Entry Object ID: ', entryID);

		
		var golfer1 = req.body.golfer1;
		var rank1 = req.body.rank1;
		var golfer2 = req.body.golfer2;
		var rank2 = req.body.rank2;
		var golfer3 = req.body.golfer3;
		var rank3 = req.body.rank3;
		var golfer4 = req.body.golfer4;
		var rank4 = req.body.rank4;
		var golfer5 = req.body.golfer5;
		var rank5 = req.body.rank5;
		var golfer6 = req.body.golfer6;
		var rank6 = req.body.rank6;

		console.log('Rank 1 outside find: ', rank1);
		console.log('Rank 2 outside find: ', rank2);
		console.log('Rank 3 outside find: ', rank3);
		console.log('Rank 4 outside find: ', rank4);
		console.log('Rank 5 outside find: ', rank5);
		console.log('Rank 6 outside find: ', rank6);

		// models.Scorecard.find({ $or: [ {golfer:golfer1}, {golfer:golfer2}, {golfer:golfer3}, {golfer:golfer4}, {golfer:golfer5}, {golfer:golfer6} ]
		// }, (err, golfer1Scores) => {
		// 	console.log('Rank 1 inside find: ', rank1);
		// 	console.log("golfer 1 Scores: ", golfer1Scores);
		// 	console.log('Golfer 1 Round 1: ', golfer1Scores[0].round1);
		// 	console.log('Golfer 2 Round 1: ', golfer1Scores[1].round1);
		// 	console.log('Golfer 3 Round 1: ', golfer1Scores[2].round1);
		// 	console.log('Golfer 4 Round 1: ', golfer1Scores[3].round1);
		// 	console.log('Golfer 5 Round 1: ', golfer1Scores[4].round1);
		// 	console.log('Golfer 6 Round 1: ', golfer1Scores[5].round1);
		// 	models.Entry.update({},{ $set: {
		// 		golfer1:{
		// 			name: golfer1Scores[0].golfer,
		// 			rank: rank1,
		// 			position: golfer1Scores[0].position,
		// 			round1: golfer1Scores[0].round1,
		// 			round2: golfer1Scores[0].round2,
		// 			round3: golfer1Scores[0].round3,
		// 			round4: golfer1Scores[0].round4,
		// 			total: golfer1Scores[0].total
		// 		},
		// 		golfer2:{
		// 			name: golfer1Scores[1].golfer,
		// 			rank: rank2,
		// 			position: golfer1Scores[1].position,
		// 			round1: golfer1Scores[1].round1,
		// 			round2: golfer1Scores[1].round2,
		// 			round3: golfer1Scores[1].round3,
		// 			round4: golfer1Scores[1].round4,
		// 			total: golfer1Scores[1].total
		// 		},
		// 		golfer3:{
		// 			name: golfer1Scores[2].golfer,
		// 			rank: rank3,
		// 			position: golfer1Scores[2].position,
		// 			round1: golfer1Scores[2].round1,
		// 			round2: golfer1Scores[2].round2,
		// 			round3: golfer1Scores[2].round3,
		// 			round4: golfer1Scores[2].round4,
		// 			total: golfer1Scores[2].total
		// 		},
		// 		golfer4:{
		// 			name: golfer1Scores[3].golfer,
		// 			rank: rank4,
		// 			position: golfer1Scores[3].position,
		// 			round1: golfer1Scores[3].round1,
		// 			round2: golfer1Scores[3].round2,
		// 			round3: golfer1Scores[3].round3,
		// 			round4: golfer1Scores[3].round4,
		// 			total: golfer1Scores[3].total
		// 		},
		// 		golfer5:{
		// 			name: golfer1Scores[4].golfer,
		// 			rank: rank5,
		// 			position: golfer1Scores[4].position,
		// 			round1: golfer1Scores[4].round1,
		// 			round2: golfer1Scores[4].round2,
		// 			round3: golfer1Scores[4].round3,
		// 			round4: golfer1Scores[4].round4,
		// 			total: golfer1Scores[4].total
		// 		},
		// 		golfer6:{
		// 			name: golfer1Scores[5].golfer,
		// 			rank: rank6,
		// 			position: golfer1Scores[5].position,
		// 			round1: golfer1Scores[5].round1,
		// 			round2: golfer1Scores[5].round2,
		// 			round3: golfer1Scores[5].round3,
		// 			round4: golfer1Scores[5].round4,
		// 			total: golfer1Scores[5].total
		// 		}
		// 	}}, { upsert: true }, function(error) {
				
		// 	});
		// 	// console.log(JSON.stringify(golfer1Scores, null, 2));
		// });

		models.Scorecard.find({golfer:golfer1}, (err, golfer1Scores) => {
			if(golfer1Scores == '') {
				console.log(`${golfer1} is not playing in this tournament`);
				models.Entry.update({},{ $set: {
					golfer1:{
						name: golfer1,
						rank: rank1,
						position: 'DNP',
					}}}, function(error) {
				});
				return;
			} else {
				models.Entry.update({},{ $set: {
					golfer1:{
						name: golfer1Scores[0].golfer,
						rank: rank1,
						position: golfer1Scores[0].position,
						round1: golfer1Scores[0].round1,
						round2: golfer1Scores[0].round2,
						round3: golfer1Scores[0].round3,
						round4: golfer1Scores[0].round4,
						total: golfer1Scores[0].total
					}}}, function(error) {
					
				});
				// console.log(JSON.stringify(golfer2Scores, null, 2));
			}
		});
		
		models.Scorecard.find({golfer:golfer2}, (err, golfer2Scores) => {
			if(golfer2Scores == '') {
				console.log(`${golfer2} is not playing in this tournament`);
				models.Entry.update({},{ $set: {
					golfer2:{
						name: golfer2,
						rank: rank2,
						position: 'DNP',
					}}}, function(error) {
				});
				return;
			} else {
				models.Entry.update({},{ $set: {
					golfer2:{
						name: golfer2Scores[0].golfer,
						rank: rank2,
						position: golfer2Scores[0].position,
						round1: golfer2Scores[0].round1,
						round2: golfer2Scores[0].round2,
						round3: golfer2Scores[0].round3,
						round4: golfer2Scores[0].round4,
						total: golfer2Scores[0].total
					}}}, function(error) {
					
				});
				// console.log(JSON.stringify(golfer2Scores, null, 2));
			}
		});

		models.Scorecard.find({golfer:golfer3}, (err, golfer3Scores) => {
			if(golfer3Scores == '') {
				console.log(`${golfer3} is not playing in this tournament`);
				models.Entry.update({},{ $set: {
					golfer3:{
						name: golfer3,
						rank: rank3,
						position: 'DNP',
					}}}, function(error) {
				});
				return;
			} else {
				models.Entry.update({},{ $set: {
					golfer3:{
						name: golfer3Scores[0].golfer,
						rank: rank3,
						position: golfer3Scores[0].position,
						round1: golfer3Scores[0].round1,
						round2: golfer3Scores[0].round2,
						round3: golfer3Scores[0].round3,
						round4: golfer3Scores[0].round4,
						total: golfer3Scores[0].total
					}}}, function(error) {
					
				});
			// console.log(JSON.stringify(golfer3Scores, null, 2));
			}
		});
			
		models.Scorecard.find({golfer:golfer4}, (err, golfer4Scores) => {
			if(golfer4Scores == '') {
				console.log(`${golfer4} is not playing in this tournament`);
				models.Entry.update({},{ $set: {
					golfer4:{
						name: golfer4,
						rank: rank4,
						position: 'DNP',
					}}}, function(error) {
				});
				return;
			} else {
				models.Entry.update({},{ $set: {
					golfer4:{
						name: golfer4Scores[0].golfer,
						rank: rank4,
						position: golfer4Scores[0].position,
						round1: golfer4Scores[0].round1,
						round2: golfer4Scores[0].round2,
						round3: golfer4Scores[0].round3,
						round4: golfer4Scores[0].round4,
						total: golfer4Scores[0].total
					}}}, function(error) {
					
				});
				// console.log(JSON.stringify(golfer4Scores, null, 2));
			}
		});
			
		models.Scorecard.find({golfer:golfer5}, (err, golfer5Scores) => {
			if(golfer5Scores == '') {
				console.log(`${golfer5} is not playing in this tournament`);
				models.Entry.update({},{ $set: {
					golfer5:{
						name: golfer5,
						rank: rank5,
						position: 'DNP',
					}}}, function(error) {
				});
				return;
			} else {
					models.Entry.update({},{ $set: {
						golfer5:{
							name: golfer5Scores[0].golfer,
							rank: rank5,
							position: golfer5Scores[0].position,
							round1: golfer5Scores[0].round1,
							round2: golfer5Scores[0].round2,
							round3: golfer5Scores[0].round3,
							round4: golfer5Scores[0].round4,
							total: golfer5Scores[0].total
						}}}, function(error) {
						
					});			
				// console.log(JSON.stringify(golfer5Scores, null, 2));
			}
		});
		
		models.Scorecard.find({golfer:golfer6}, (err, golfer6Scores) => {
			if(golfer6Scores == '') {
				console.log(`${golfer6} is not playing in this tournament`);
				models.Entry.update({},{ $set: {
					golfer6:{
						name: golfer6,
						rank: rank6,
						position: 'DNP',
					}}}, function(error) {
				});
				return;
			} else {
				models.Entry.update({},{ $set: {
					golfer6:{
						name: golfer6Scores[0].golfer,
						rank: rank6,
						position: golfer6Scores[0].position,
						round1: golfer6Scores[0].round1,
						round2: golfer6Scores[0].round2,
						round3: golfer6Scores[0].round3,
						round4: golfer6Scores[0].round4,
						total: golfer6Scores[0].total
					}}}, function(error) {
					
				});
				// console.log(JSON.stringify(golfer6Scores, null, 2));	
			}				
		});

		models.Entry.find({}, (err, team) => {
			console.log(JSON.stringify(team, null, "\t"));
						
			var hbsObject = {
				golfers: team,
			};    
			// console.log(hbsObject);
			res.render('teams', hbsObject);    
		});  


	});

	
    app.post('/team/new', (req, res) => {
		console.log('Entire Body: ', req.body);

		console.log('Golfer 1: ', req.body.golfer1.name);
		console.log('Golfer 1 Rank: ', req.body.golfer1.rank);

        var team = new models.Entry({
			entryName: req.body.entryName,
			golfer1: {
				name: req.body.golfer1.name,
				rank: req.body.golfer1.rank,
				position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
				total: null
			},
			golfer2: {
				name: req.body.golfer2.name,
				rank: req.body.golfer2.rank,
				position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
				total: null
			},
			golfer3: {
				name: req.body.golfer3.name,
				rank: req.body.golfer3.rank,
				position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
				total: null
			},
			golfer4: {
				name: req.body.golfer4.name,
				rank: req.body.golfer4.rank,
				position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
				total: null
			},
			golfer5: {
				name: req.body.golfer5.name,
				rank: req.body.golfer5.rank,
				position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
				total: null
			},
			golfer6: {
				name: req.body.golfer6.name,
				rank: req.body.golfer6.rank,
				position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
				total: null
			},
        });
		
		team.save()
		.then(function(dbEntry) {
			res.redirect('/team');     
		});
		
    });
	
	app.get('/*', (req, res) => {
		res.redirect('/team');
	});

	app.post('/entry/delete/', function(req, res) {
		console.log('Delete Object ID: ', req.body.id);
		models.Entry.findByIdAndRemove(req.body.id, (err, entry) => {  
			// We'll create a simple object to send back with a message and the id of the document that was removed
			// You can really do this however you want, though.
			let response = {
				message: "Entry successfully deleted",
				id: req.body.id
			};
			res.status(200).send(response);
		});
	});
    
	app.listen(PORT, () => {
		console.log('App listening on PORT ' + PORT);
	});