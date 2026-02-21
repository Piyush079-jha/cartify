const cloudinary = require('../../config/cloudinary')

async function uploadImageController(req, res) {
    try {
        const file = req.file

        if (!file) {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'No file uploaded'
            })
        }

        // Convert buffer to base64
        const b64 = Buffer.from(file.buffer).toString('base64')
        const dataURI = `data:${file.mimetype};base64,${b64}`

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'cartify-products',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        })

        res.json({
            success: true,
            error: false,
            message: 'Image uploaded successfully',
            url: result.secure_url
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            error: true,
            message: err.message || 'Upload failed'
        })
    }
}

module.exports = uploadImageController