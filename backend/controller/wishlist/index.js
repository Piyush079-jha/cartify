const wishlistModel = require("../../models/wishlistModel")

// Add to Wishlist (Toggle - adds if not exists, removes if exists)
async function addToWishlistController(req, res) {
    try {
        const { productId } = req?.body
        const currentUser = req.userId

        const isProductInWishlist = await wishlistModel.findOne({
            productId: productId,
            userId: currentUser
        })

        if (isProductInWishlist) {
            const deleteProduct = await wishlistModel.deleteOne({
                _id: isProductInWishlist._id
            })
            return res.json({
                message: "Removed from Wishlist",
                error: false,
                success: true,
                data: deleteProduct
            })
        }

        const payload = {
            productId: productId,
            userId: currentUser,
        }

        const newWishlistProduct = new wishlistModel(payload)
        const saveProduct = await newWishlistProduct.save()

        return res.json({
            data: saveProduct,
            message: "Added to Wishlist",
            success: true,
            error: false
        })

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

// Count Wishlist Products
async function countWishlistProducts(req, res) {
    try {
        const userId = req.userId
        const count = await wishlistModel.countDocuments({ userId: userId })
        res.json({
            data: { count: count },
            message: "ok",
            error: false,
            success: true
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

// Get Wishlist Products
async function getWishlistProducts(req, res) {
    try {
        const currentUser = req.userId
        const allProduct = await wishlistModel.find({
            userId: currentUser
        }).populate("productId")

        res.json({
            data: allProduct,
            success: true,
            error: false
        })
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

// Remove from Wishlist
async function removeFromWishlistController(req, res) {
    try {
        const wishlistProductId = req.body._id
        const deleteProduct = await wishlistModel.deleteOne({ _id: wishlistProductId })
        res.json({
            message: "Product Removed From Wishlist",
            error: false,
            success: true,
            data: deleteProduct
        })
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

// 💌 Save Future You Letter
async function saveFutureLetterController(req, res) {
    try {
        const { wishlistItemId, letter, revealDate } = req.body
        const currentUser = req.userId

        const wishlistItem = await wishlistModel.findOne({
            _id: wishlistItemId,
            userId: currentUser
        })

        if (!wishlistItem) {
            return res.json({
                message: "Wishlist item not found",
                error: true,
                success: false
            })
        }

        wishlistItem.letter = letter
        wishlistItem.revealDate = new Date(revealDate)
        wishlistItem.letterRevealed = false
        await wishlistItem.save()

        res.json({
            message: "Letter saved successfully",
            success: true,
            error: false,
            data: wishlistItem
        })

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

// 💌 Get Future You Letter (only if revealDate has passed)
async function getFutureLetterController(req, res) {
    try {
        const { wishlistItemId } = req.query
        const currentUser = req.userId

        const wishlistItem = await wishlistModel.findOne({
            _id: wishlistItemId,
            userId: currentUser
        })

        if (!wishlistItem) {
            return res.json({
                message: "Wishlist item not found",
                error: true,
                success: false
            })
        }

        const now = new Date()
        const canReveal = wishlistItem.revealDate && now >= new Date(wishlistItem.revealDate)

        if (canReveal && !wishlistItem.letterRevealed) {
            wishlistItem.letterRevealed = true
            await wishlistItem.save()
        }

        res.json({
            success: true,
            error: false,
            data: {
                letter: canReveal ? wishlistItem.letter : null,
                revealDate: wishlistItem.revealDate,
                letterRevealed: wishlistItem.letterRevealed,
                canReveal,
                hasLetter: !!wishlistItem.letter
            }
        })

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = {
    addToWishlistController,
    countWishlistProducts,
    getWishlistProducts,
    removeFromWishlistController,
    saveFutureLetterController,
    getFutureLetterController
}