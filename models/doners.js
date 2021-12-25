const  mongoose = require('mongoose');
let  doners = new  mongoose.Schema({
name:  String,
bloodGroup:  String,
mobilenumber:  Number
});

module.exports = mongoose.model('Doners', doners);