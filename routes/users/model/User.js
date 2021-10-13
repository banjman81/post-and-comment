const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        fistName : {
            type : String
        },
        lastName :{
            type: String
        },
        userName : {
            type : String,
            unique : true
        },
        email : {
            type : String,
            unique : true
        },
        password : {
            type :String
        },
        postHistory : [{type : mongoose.Schema.ObjectId, ref: 'post'}],

        commentHistory : [{type : mongoose.Schema.ObjectId, ref: 'comment'}]
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('user', userSchema)