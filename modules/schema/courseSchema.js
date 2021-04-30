const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({

    coursename : {
        type : String,
        required : true
    },

    coursecode : {
        type : String,
        required : true
    },
    identity :{
        type : String,
        required : true
    }

   
}, {timestamps : true});

const courseModel = mongoose.model('course', courseSchema);

module.exports = courseModel;