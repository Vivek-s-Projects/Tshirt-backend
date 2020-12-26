const express = require('express');
const router = express.Router();

const { getProductById, createProduct, photo, getProduct, updateProduct, deleteProduct,getAllProducts ,getAllUniqueCategories} = require('../controllers/product')
const { isAdmin, isAuthanticted, isSingedIn } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')

// Params
router.param('userId', getUserById)
router.param('productId', getProductById)

router.post('/product/create/:userId', isSingedIn, isAuthanticted, isAdmin, createProduct)
router.get('/product/:productId', getProduct)
router.get('/product/photo/:productId', photo)

// delete route
router.delete('/product/:productId/:userId', isSingedIn, isAuthanticted, isAdmin, deleteProduct)

// update route
router.put('/product/:productId/:userId', isSingedIn, isAuthanticted, isAdmin, updateProduct)

// listing route
router.get('/products',getAllProducts)


router.get('/products/categories',getAllUniqueCategories)


module.exports = router