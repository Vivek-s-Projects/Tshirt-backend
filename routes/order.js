const express = require('express');
const router = express.Router();

const {  isAuthanticted, isSingedIn, isAdmin } = require('../controllers/auth')
const { getUserById , pushOrderInPurchaseList } = require('../controllers/user')
const { updateStock } = require('../controllers/product')


const { getOrderById,createOrder ,getAllOrders,updateStatus,getOrderStatus} = require('../controllers/order')
// Params 
router.param("userId",getUserById)
router.param('orderId',getOrderById)

// Create
router.post('/order/create/:userId',isSingedIn,isAuthanticted,pushOrderInPurchaseList,updateStock,createOrder)

// Read
router.get('/order/all/:userId',isSingedIn,isAuthanticted,isAdmin,getAllOrders)

// Status
router.get('/order/status/:userId',isSingedIn,isAuthanticted,isAdmin,getOrderStatus)
router.put('/order/:orderId/status/:userId',isSingedIn,isAuthanticted,isAdmin,updateStatus)


module.exports = router;