const express = require('express')
const router = express.Router()
const { createUser, login, updateUser } = require('./controller/userController')
const { validateCreateData, checkIsEmpty, validateLoginData, checkIsUndefined} = require('./lib/authMiddleware/index')
const { jwtMiddleware } = require('./lib/authMiddleware/shared/jwtMiddleware')


router.post('/create-user', checkIsUndefined, checkIsEmpty,  validateCreateData, createUser)
router.get('/login', checkIsUndefined, checkIsEmpty, validateLoginData, login)
router.put('/update-user', jwtMiddleware, checkIsEmpty, updateUser)

module.exports = router;