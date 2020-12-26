const express = require('express')
const router = express.Router()
// const User = require('../models/user');


const { getUserById, getUser ,updateUser , userPurchaseList} = require('../controllers/user')
const { isSingedIn, isAuthanticted, isAdmin } = require('../controllers/auth')

router.param("userId", getUserById)

router.get('/user/:userId',isSingedIn,isAuthanticted, getUser)

router.put('/user/:userId',isSingedIn,isAuthanticted,updateUser)

router.get('/orders/user/:userId',isSingedIn,isAuthanticted,userPurchaseList)


// router.get('/userlist',getAllUser)


module.exports = router;

