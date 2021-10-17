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

async function updateComment(req, res){
    try{

        let foundComment = await Comment.findById(req.params.id)

        if(!foundComment){
            return res.status(404).json({
                message: "failure",
                error: 'Commment not found'
            })
        }else{

            let owner = await User.findById(foundComment.commentOwner)
            console.log(foundComment.commentOwner)
            
            let decodedData = res.locals.decodedData
            if(owner.email === decodedData.email){

                let updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {new : true})

                res.json({
                    message : 'success',
                    payload : updatedComment
                })

            }else{
                res.status(500).json({
                    message : 'failed',
                    payload : 'You are not authorized to update this content'
                })
            }
        }
            

    }catch(e){
        res.status(500).json(errorHandler(e))
    }
}

async function deleteComment(req, res){
    try{

        let foundComment = await Comment.findById(req.params.id)

        if(!foundComment){
            return res.status(404).json({
                message: "failure",
                error: 'Commment not found'
            })
        }else{

            let owner = await User.findById(foundComment.commentOwner)
            console.log(foundComment.commentOwner)
            
            let decodedData = res.locals.decodedData
            if(owner.email === decodedData.email){

                let deletedComment = await Comment.findByIdAndDelete(req.params.id)

                res.json({
                    message : 'success',
                    payload : deletedComment
                })

            }else{
                res.status(500).json({
                    message : 'failed',
                    payload : 'You are not authorized to update this content'
                })
            }
        }
            

    }catch(e){
        res.status(500).json(errorHandler(e))
    }
}

module.exports = {
    getAllComment,
    createComment,
    updateComment,
    deleteComment
}