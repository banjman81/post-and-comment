const express = require('express')
const router = express.Router()
const { createUser } = require('./controller/userController')
const { validateCreateData, checkIsEmpty} = require('./lib/authMiddleware/index')


router.post('/create-user',checkIsEmpty, validateCreateData, createUser)

module.exports = router;