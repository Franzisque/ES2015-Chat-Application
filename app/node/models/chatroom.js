// Dependencies
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define User Schema
let schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    // Reference to User
    users: [{
        type: String,
        ref: 'User'
    }]
});


// Create model class and export
module.exports = mongoose.model('Chatroom', schema);
