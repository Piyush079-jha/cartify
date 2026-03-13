const reviewModel = require('../../models/reviewModel')

// Add Review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment, images } = req.body
        const userId = req.userId

        // Check if user already reviewed this product
        const existingReview = await reviewModel.findOne({ productId, userId })
        if (existingReview) {
            return res.json({ success: false, message: 'You have already reviewed this product' })
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
        return res.json({ success: true, message: 'Review added successfully', data: review })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
}

// Get Reviews for a product
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params
        const reviews = await reviewModel.find({ productId }).sort({ createdAt: -1 })
        return res.json({ success: true, data: reviews })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
}

// Edit Review (only by owner)
const editReview = async (req, res) => {
    try {
        const { reviewId, rating, comment, images } = req.body
        const userId = req.userId

        const review = await reviewModel.findById(reviewId)
        if (!review) return res.json({ success: false, message: 'Review not found' })
        if (review.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Not authorized to edit this review' })
        }

        review.rating = rating || review.rating
        review.comment = comment || review.comment
        review.images = images || review.images
        await review.save()

        return res.json({ success: true, message: 'Review updated successfully', data: review })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
}

// Delete Review (by owner or admin)
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body
        const userId = req.userId
        const userRole = req.userDetails?.role

        const review = await reviewModel.findById(reviewId)
        if (!review) return res.json({ success: false, message: 'Review not found' })

        // Allow delete if owner or admin
        if (review.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
            return res.json({ success: false, message: 'Not authorized to delete this review' })
        }

        await reviewModel.findByIdAndDelete(reviewId)
        return res.json({ success: true, message: 'Review deleted successfully' })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
}

module.exports = { addReview, getReviews, editReview, deleteReview }