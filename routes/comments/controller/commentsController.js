const Comment = require('../model/Comment')
const Post = require('../../posts/model/Post')
const User = require('../../users/model/User')

const errorHandler = require('../../util/errorHandler/errorHandler')

async function getAllComment(req, res){
    try{
        let allComments = await Comment.find({})

        res.json({
            message : 'success',
            payload : allComments
        })
    }catch(e){
        return res.status(500).json(errorHandler(e))
    }
}

async function createComment(req, res){
    try{
        let foundPost = await Post.findById(req.params.id)
        if(foundPost){
            const {comment} = req.body

            let decodedData = res.locals.decodedData

            let foundUser = await User.findOne({email : decodedData.email})

            const createdComment = new Comment({
                comment,
                parentPost : foundPost._id,
                commentOwner : foundUser._id
            })

            let savedComment = await createdComment.save()

            foundUser.commentHistory.push(savedComment._id)

            foundPost.comments.push(savedComment._id)

            foundUser.save()
            foundPost.save()

            return res.json({
                message: 'success',
                pauload: savedComment
            })


        }else{
            return res.status(404).json({
                message: 'error',
                error: 'Post does not exist'
            })
        }
        

    }catch(e){
        return res.status(500).json(errorHandler(e))
    }
}

module.exports = {
    getAllComment,
    createComment
}