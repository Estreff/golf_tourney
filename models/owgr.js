const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OWGRSchema = new Schema({
	currentRank: Number,
	lastWeekRank: Number,
	country: String,
	name: String,
	events: Number
	   
});

var OWGR = mongoose.model('OWGR', OWGRSchema);

module.exports = OWGR;
