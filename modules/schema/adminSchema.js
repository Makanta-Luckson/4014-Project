const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({

    title : {
        type : String,
        required : true
    },

    firstname : {
        type : String,
        required : true
    },

    lastname : {
        type : String,
        required : true
    },
  
    email: {
        type : String,
        required : true
    },

    department : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    },


});

const userModel = mongoose.model('admin', adminSchema);

module.exports = userModel;
