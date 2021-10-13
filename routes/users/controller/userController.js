
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

async function login(req, res){
    const {email, password} = req.body

    try{

        let foundUser = await User.findOne({email: email})

        if(!foundUser){
            return res.status(500).json({
                message : 'error',
                error : "User does not exist. Please sign up"
            })
        }else{
            let comparedPassword = await bcrypt.compare(password, foundUser.password)

            if(!comparedPassword){
                return res.status(500).json({
                    message : 'error',
                    error: 'Incorrect password'
                })
            }else{
                let jwtToken = jwt.sign (
                    {
                        email : foundUser.email,
                        username : foundUser.username
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn : '24h'
                    }
                )

                res.json({
                    message: "success",
                    token: jwtToken
                })
            }
        }

    }catch(e){
        res.status(500).json({
            message: "error",
            error: errorHandler(e)
        })
    }
}

async function updateUser(req, res){
    try{
        const {password} = req.body

        const decodedData = res.locals.decodedData

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password, salt)

        req.body.pasword = hashedPassword

        let updatedUser = await User.findOneAndUpdate({email : decodedData.email}, req.body, {new : true})

        res.json({
            message : 'success',
            payload : updatedUser
        })
    }catch(e){
        res.status(500).json({
            message : 'error', error : errorHandler(e)
        })
    }
}

module.exports = {
    createUser,
    login,
    updateUser
}

