const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../model/User')
const { FailedDependency } = require('http-errors')
const errorHandler = require('../../util/errorHandler/errorHandler')

async function createUser(req, res){
    let body = req.body
    const {firstName, lastName, username, email, password} = body
    let salt = await bcrypt.genSalt(10)
    let hashed = await bcrypt.hash(password, salt)

    try{
        const createdUser = new User({
            firstName,
            lastName,
            username,
            email,
            password : hashed
        })

        let savedUser = await createdUser.save()

        res.json({
            message : 'success',
            payload: savedUser
        })
    }catch(e){
        res.status(500).json({
            message: 'Failed',
            error : errorHandler(e)
        })
    }
}

module.exports = {
    createUser,
}

