const User = require('../models/user')
const { validationResult } = require('express-validator')
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.singup = (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user in db"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })

}

exports.singin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()[0].msg
        })
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User Email Not Axist"
            })
        }

        if (!user.autheticate(password)) {
            return res.status(401).json({
                error: "Email & Password not match"

            })
        }
        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET)
        // put in cookie
        res.cookie('token', token, { expire: new Date() + 9999 })

        // Send response to frontend
        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role
            }
        })

    })
}

exports.singout = (req,res) => {
    res.clearCookie("token")
    res.json({
        message: "Singh out Done!"
    })
}

// Protacted Routes
exports.isSingedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty :"auth"
})


// Custom Middlewares

exports.isAuthanticted = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            error : "Access Deline"
        })
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "You are not admin, Access denied"
        })
    }

    next();
}