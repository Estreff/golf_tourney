var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema =  Schema({
	// `title` is of type String
	title: String,
	// `body` is of type String
	body: String
  });
   
    var EntrySchema = new Schema ({
        golfer1: String,
        golfer2: String,
        golfer3: String,
        golfer4: String,
        golfer5: String,
        golfer6: String
    });

var Entry = mongoose.model('Entry', EntrySchema);

module.exports = Entry;