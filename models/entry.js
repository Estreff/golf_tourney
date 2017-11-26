var mongoose = require('mongoose');
var Schema = mongoose.Schema;
   
    var EntrySchema = new Schema ({
        // entryName: String,
        // golfer1: String,
        // golfer1Rank: Number,
        // golfer2: String,
        // golfer2Rank: Number,
        // golfer3: String,
        // golfer3Rank: Number,
        // golfer4: String,
        // golfer4Rank: Number,
        // golfer5: String,
        // golfer5Rank: Number,
        // golfer6: String,
        // golfer6Rank: Number

        entryName: String,
        golfer1: {
            name: String,
            rank: Number,
            position: String,
            round1: Number,
            round2: Number,
            round3: Number,
            round4: Number,
            total: Number,
        },
        golfer2: {
            name: String,
            rank: Number,
            position: String,
            round1: Number,
            round2: Number,
            round3: Number,
            round4: Number,
            total: Number,
        },
        golfer3: {
            name: String,
            rank: Number,
            position: String,
            round1: Number,
            round2: Number,
            round3: Number,
            round4: Number,
            total: Number,
        },
        golfer4: {
            name: String,
            rank: Number,
            position: String,
            round1: Number,
            round2: Number,
            round3: Number,
            round4: Number,
            total: Number,
        },
        golfer5: {
            name: String,
            rank: Number,
            position: String,
            round1: Number,
            round2: Number,
            round3: Number,
            round4: Number,
            total: Number,
        },
        golfer6: {
            name: String,
            rank: Number,
            position: String,
            round1: Number,
            round2: Number,
            round3: Number,
            round4: Number,
            total: Number,
        }
    });

var Entry = mongoose.model('Entry', EntrySchema);

module.exports = Entry;