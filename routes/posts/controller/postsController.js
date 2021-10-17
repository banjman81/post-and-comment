const Post = require('../model/Post')
const User = require('../../users/model/User')

const {isEmpty} = require('validator')

const errorHandler = require('../../util/errorHandler/errorHandler')

async function getAllPost( req, res){
    try{
        let allPosts = await Post.find({}).populate('comments', '-parentPost')

        res.json({
            message : 'success',
            payload : allPosts
        })
    }catch(e){
        res.status(500).json(errorhandler(e))
    }
}

async function createPost(req, res){
    try{
        const { title, content} = req.body

        let decodedData = res.locals.decodedData

        let foundUser = await User.findOne({email: decodedData.email})

        const createdPost = new Post({
            title,
            content,
            postOwner : foundUser._id
        })

        let savedPost = await createdPost.save()

        foundUser.postHistory.push(savedPost._id)

        await foundUser.save()

        res.json({
            message : "success",
            payoad: savedPost
        })

    }catch(e){
        res.status(500).json({
            message: "error",
            error: errorHandler(e)
        })
    }
}

async function updatePost(req, res){
    try{
        let foundPost = await Post.findById(req.params.id)

        if(!foundPost){
            return res.status(404).json({
                message: "failure",
                error: 'Post not found'
            })
        }else{

            let owner = await User.findById(foundPost.postOwner)

            let decodedData = res.locals.decodedData

            if(owner.email === decodedData.email){
                let updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new : true})

                res.json({
                    message: 'success',
                    payload : updatedPost
                })
            }else{
                res.status(500).json({
                    message : 'failed',
                    payload : 'You are not authorized to update this content'
                })
            }
        }
    }catch(e){
        return res.status(500).json(errorHandler(e))
    }
}

async function deletePost(req, res){
    try{
        let foundPost = await Post.findById(req.params.id)

        if(!foundPost){
            return res.status(404).json({
                message: "failure",
                error: 'Post not found'
            })
        }else{
            let deletedOrder = await Post.findByIdAndDelete(req.params.id)

            let decodedData = res.locals.decodedData

            let foundUser = await User.findOne({email: decodedData.email})

            let userPostHistory = foundUser.postHistory

            let filteredPostHistory = userPostHistory.filter(
                (item) => item._id.toString() !== req.params.id
            )

            foundUser.postHistory = filteredPostHistory

            await foundUser.save()

            res.json({
                message: 'success',
                payload : deletedOrder
            })
        }

    }catch(e){
        return res.status(500).json(errorHandler(e))
    }
}

module.exports = {
    createPost,
    getAllPost,
    updatePost,
    deletePost
}