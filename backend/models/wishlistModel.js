const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    productId: {
        ref: 'product',
        type: String,
    },
    userId: String,

    // 💌 Future You Letter
    letter: {
        type: String,
        default: ''
    },
    revealDate: {
        type: Date,
        default: null
    },
    letterRevealed: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

const wishlistModel = mongoose.model('wishlist', wishlistSchema)

module.exports = wishlistModel