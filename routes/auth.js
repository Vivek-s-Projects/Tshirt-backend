var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
const { singout, singup, singin, isSingedIn } = require('../controllers/auth')


router.post('/singup', [
    check('name').isLength({ min: 3 }).withMessage('Name must be 3 char'),
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').isLength({ min: 3 }).withMessage('password must be 3 char')
], singup)


router.post('/singin', [
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').isLength({ min: 3 }).withMessage('password Filed is required!')
], singin)



router.get("/singout", singout)

// router.get("/testroute", isSingedIn, (req, res) =>
//     res.json(req.auth)
// )

module.exports = router;