const  mongoose =  require('mongoose');
const crypto = require('crypto');
// import { v4 as uuidv4 } from 'uuid';
const uuidv1 = require('uuid/v1')
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
       
        unique: true
    },
    userinfo: {
        type: String,
        // required: true
    },
    encry_password: {
        type: String,
        trim: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
},{
    timestamps: true
});

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.encry_password = this.securePassword(password)
    })
    .get(function () {
        return this._password
    })


userSchema.methods = {

    autheticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password
    },
  

    securePassword: function (plainPassword) {
        if (!plainPassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');
        } catch (err) {
            return "";
        }
    }
}
module.exports = mongoose.model("User", userSchema)