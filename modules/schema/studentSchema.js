const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstname : {
        type : String,
        required : true
    },

    lastname : {
        type : String,
        required : true
    },
    sex: {
        type : String,
        required : true
    },
    number : {
        type : String,
        required : true
    },
    email :  {
        type : String,
        required : true
    },
    year: {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
}, {timestamps : true});

const studentModel = mongoose.model('student', studentSchema);

module.exports = studentModel;