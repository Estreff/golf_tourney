var mongoose = require('mongoose');
var Schema = mongoose.Schema;

	var OWGRSchema = new Schema({
		player_name: {
			type: String,
			// required: true,
			unique: true
		},
		rank: {
			type: Number
			// required: true
        },       
    });

var OWGR = mongoose.model('OWGR', OWGRSchema);

module.exports = OWGR;
