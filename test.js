const cheerio = require('cheerio');
const express = require('express');
const mongojs = require('mongojs');
const request = require('request');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 8080;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

var db = mongojs('majors', ['scorecards']);

app.get('/', (req, res) => {
    res.render('team');
});

app.get('/owgr', (req, res) => {
    db.owgrs.find({}, (err, rankings) => {
        var hbsObject = {
            owgr: rankings
        };
        
        res.render('owgr', hbsObject);
    });
});

app.get('/owgr/update', (req, res) => {
    db.owgrs.remove({});
    request("http://www.owgr.com/ranking?pageNo=1&pageSize=500&country=All", function(error, response, html) {
        
        var $ = cheerio.load(html);
        
        $('div.table_container tbody tr').each(function(i, element) {
            var currentRank = $(element).find('td:nth-child(1)').text().trim();
            var lastWeekRank = $(element).find('td:nth-child(2)').text().trim();
            var country = $(element).find('td.ctry').children().attr('title').trim();
            var golferName = $(element).find('td.name').text().trim();
            var events = $(element).find('td:nth-child(11)').text().trim();
            
            
            var owgr = {
                currentRank: currentRank,
                lastWeekRank: lastWeekRank,
                country: country,
                name: golferName,
                events: events
            };
            
            console.log(owgr);
            db.owgrs.insert(owgr);
            
        });
        console.log('OWGR inserted!!!!!')
        
        db.owgrs.find({}, (err, rankings) => {
            var hbsObject = {
                owgr: rankings
            };
            
            res.redirect('/owgr');
        });
    });
});
 



app.get('/PGAleaderboard', (req, res) => {
    db.scorecards.find({}, (err, posts) => {
        //  res.json(posts));
        var hbsObject = {
            golfers: posts
        };
        
        res.render('index', hbsObject);
    });
});

app.get('/PGAleaderboard/update', (req, res) => {
    db.scorecards.remove({});
        request("http://www.golfchannel.com/tours/pga-tour", function(error, response, html) {
        
                var $ = cheerio.load(html);
        
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
            db.scorecards.insert(data);	
        });	
        
        console.log('Record Inserted');

        db.scorecards.find({}, (err, posts) => {
            //  res.json(posts));
            var hbsObject = {
                golfers: posts
            };
            
            res.redirect('/PGAleaderboard');
        }); 
    });
});


    app.get('/teamCreate', (req, res) => {
        db.owgrs.find({}, (err, posts) => {
            //  res.json(posts));
            var hbsObject = {
                golfers: posts,
            };    
            res.render('teamCreate', hbsObject);    
        });

    });

    app.get('/team', (req, res) => {
        db.teams.find({}, (err, team) => {
            //  res.json(posts));
            var hbsObject = {
                golfers: team,
            };    
            res.render('teams', hbsObject);    
        });        
    });

    app.get('/team/new', (req, res) => {
        var team = {
            golfer1: req.body.golfer1,
            golfer2: req.body.golfer2,
            golfer3: req.body.golfer3,
            golfer4: req.body.golfer4,
            golfer5: req.body.golfer5,
            golfer6: req.body.golfer6,
        }

        db.team.insert(team);	        
    
    });

    
  
app.listen(PORT, () => {
    console.log('App listening on PORT ' + PORT);
});