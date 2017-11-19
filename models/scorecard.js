var mongoose = require('mongoose');
var Schema = mongoose.Schema;
   
    var ScorecardSchema = new Schema ({
        player: {
			type: String
			// required: true,
			// unique: true
        },
        position: {
            type: Number
            // required: true
        },
        overall: {
			type: String
			// required: true
        },
        thru: {
			type: Number
			// required: true
        },
        round_score: {
			type: Number
			// required: true
		},
        round1: {
			type: Number
			// required: true
		},
        round2: {
			type: Number
			// required: true
		},
        round3: {
			type: Number
			// required: true
		},
        round4: {
			type: Number
			// required: true
		},
        total: {
			type: Number
			// required: true
		}
    });

    var Scorecard = mongoose.model('Scorecard', ScorecardSchema);
    
    module.exports = Scorecard;

