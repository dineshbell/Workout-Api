const mongoose = require("mongoose");

const gymexercises = new mongoose.Schema({
    bodyPart:{
        type:String,
        required:true,
    },
    equipment:{
        type:String,
        required:true,
    },
    gifUrl:{
        type:String,
        required:true,
    },
    id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    target:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('gymexercises',gymexercises);