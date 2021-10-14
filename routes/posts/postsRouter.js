const express = require('express')
const router = express.Router()

const {checkIsEmpty} = require('../users/lib/authMiddleware/shared/checkIsEmpty')
const { createPost, getAllPost, updatePost, deletePost } = require('./controller/postsController')
const { jwtMiddleware } = require('../users/lib/authMiddleware/shared/jwtMiddleware')

router.get('/', getAllPost)
router.post('/create-post', jwtMiddleware, checkIsEmpty, createPost)
router.put('/update-post-by-id/:id', jwtMiddleware, updatePost)
router.delete('/delete-post/:id', jwtMiddleware, deletePost)


module.exports = router