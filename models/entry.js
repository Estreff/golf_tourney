var mongoose = require('mongoose');
var Schema = mongoose.Schema;
   
    var EntrySchema = new Schema ({
        entryName: String,
        golfer1: String,
        golfer1Rank: Number,
        golfer2: String,
        golfer2Rank: Number,
        golfer3: String,
        golfer3Rank: Number,
        golfer4: String,
        golfer4Rank: Number,
        golfer5: String,
        golfer5Rank: Number,
        golfer6: String,
        golfer6Rank: Number
    });

var Entry = mongoose.model('Entry', EntrySchema);

module.exports = Entry;