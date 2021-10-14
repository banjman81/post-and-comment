const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
    {
        comment : {
            type : String
        },
        parentPost:{
            type : mongoose.Schema.ObjectId,
            ref : "post"
        },
        commentOwner : {
            type : mongoose.Schema.ObjectId,
            ref : "user"
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("comment", CommentSchema)