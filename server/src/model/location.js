/**
 * Created by anmolgupta on 05/07/15.
 */
var mongoose = require('mongoose');

var venueSchema = new mongoose.Schema({
    name: String,
    loc: [],
    chatUrl: String
});

venueSchema.index({ loc: '2dsphere' });

module.exports =mongoose.model('Location', venueSchema);
