var mongoose = require('mongoose');
var Schema = mongoose.Schema;
   
    var EntrySchema = new Schema ({
        player1: {
			type: String
			// required: true,
			// unique: true
        },
        player2: {
			type: String
			// required: true,
			// unique: true
        },
        player3: {
			type: String
			// required: true,
			// unique: true
        },
        player4: {
			type: String
			// required: true,
			// unique: true
        },
        player5: {
			type: String
			// required: true,
			// unique: true
        },
        player6: {
			type: String
			// required: true,
			// unique: true
        }
    });

var Entry = mongoose.model('Entry', EntrySchema);

module.exports = Scorecard;