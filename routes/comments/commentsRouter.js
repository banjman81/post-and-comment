const express = require('express')
const router = express.Router()

const {} = require('../users/lib/authMiddleware/shared/checkIsEmpty')
const { checkIsEmpty, checkIsUndefined} = require('../../routes/users/lib/authMiddleware/index')
const { getAllComment, createComment } = require('./controller/commentsController')
const { jwtMiddleware } = require('../users/lib/authMiddleware/shared/jwtMiddleware')

router.get('/', checkIsEmpty, getAllComment)
router.post('/create-comment/:id',jwtMiddleware, checkIsUndefined, checkIsEmpty, createComment)

module.exports = router