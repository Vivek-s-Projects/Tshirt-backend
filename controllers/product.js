const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { error } = require('console')
const { sortBy } = require('lodash')


exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate('category')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product not found"
                })
            }
            req.product = product;
            next();

        })
}

exports.createProduct = (req, res) => {
    // Formadable
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (error, fields, file) => {
        if (error) {
            return res.status(400).json({
                error: "problem with image"
            })
        }
        // Destrucring fileds
        const { name, description, price, category, stock, } = fields

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: " Please inclode all filed!!!!"
            })
        }

        let product = new Product(fields)


        // Handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // save to DB
        product.save((err, product) => {
            if (error) {
                return res.status(400).json({
                    error: "Saving tshirt in db failed"
                })
            }
            res.json(product);
        })
    })

}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();

}
// delete

exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, dltpro) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete product!"
            })
        }
        res.json({
            message: "Deletion is sucessful!!"

        })
    })
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (error, fields, file) => {
        if (error) {
            return res.status(400).json({
                error: "problem with image"
            })
        }

        // updation code!
        let product = req.product
        product = _.extend(product, fields)

        // Handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // save to DB
        product.save((err, product) => {
            if (error) {
                return res.status(400).json({
                    error: "updation failed!"
                })
            }
            res.json(product);
        })
    })

}

// product listing
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
        .select("-photo")
        .populate("category")
        .limit(limit)
        .sort([[sortBy, "acs"]])
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No Product Found!"
                })
            }
            res.json(products)
        })
}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct('category', {} , (err,category) => {
        if(err){
            return res.status(400).json({
                error : "No category found !!"
            })
        }
        res.json(category)
    })
} 

exports.updateStock = (req, res, next) => {
    let myOperation = req.body.order.product.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })
    Product.bulkWrite(myOperation,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error : "Bulk operation Failed!"
            })
        }

    })
}