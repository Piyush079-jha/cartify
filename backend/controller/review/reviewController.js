const reviewModel = require('../../models/reviewModel')

// GET /api/get-reviews/:productId
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params
        const reviews = await reviewModel.find({ productId }).sort({ createdAt: -1 })
        res.json({ success: true, data: reviews })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// POST /api/add-review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment, images } = req.body
        const userId = req.userId

        if (!productId || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'productId, rating and comment are required' })
        }

        // One review per user per product
        const existing = await reviewModel.findOne({ productId, userId })
        if (existing) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product. Please edit your existing review.' })
        }

        const review = new reviewModel({
            productId,
            userId,
            userName: req.userDetails?.name || 'User',
            userProfilePic: req.userDetails?.profilePic || '',
            rating,
            comment,
            images: images || []
        })

        await review.save()
        res.json({ success: true, message: 'Review added successfully', data: review })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// POST /api/edit-review
const editReview = async (req, res) => {
    try {
        const { reviewId, rating, comment, images } = req.body
        const userId = req.userId

        const review = await reviewModel.findById(reviewId)
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' })
        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this review' })
        }

        review.rating = rating ?? review.rating
        review.comment = comment ?? review.comment
        review.images = images ?? review.images
        await review.save()

        res.json({ success: true, message: 'Review updated successfully', data: review })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// POST /api/delete-review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body
        const userId = req.userId

        const review = await reviewModel.findById(reviewId)
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' })

        // Allow owner or admin
        const isOwner = review.userId.toString() === userId.toString()
        const isAdmin = req.userDetails?.role === 'ADMIN'
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' })
        }

        await reviewModel.findByIdAndDelete(reviewId)
        res.json({ success: true, message: 'Review deleted successfully' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = { getReviews, addReview, editReview, deleteReview }