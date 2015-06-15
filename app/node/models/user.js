// Dependencies
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define User Schema
let schema = new Schema({
    username: {
        type: String,
        unique: true
    }
});


// Create user model class and export
module.exports = mongoose.model('User', schema);
