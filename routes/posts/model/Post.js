const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {
        title : {
            type: String
        },
        content : {
            type : String
        },
        postOwner : {
            type : mongoose.Schema.ObjectId,
            ref: "user"
        },
        comments : [{type : mongoose.Schema.ObjectId, ref: 'comment'}]

    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("post", PostSchema)