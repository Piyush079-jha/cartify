const userModel = require("../../models/userModel")
const bcrypt = require("bcryptjs")

async function resetPasswordController(req, res) {
    try {
        const { email, token, newPassword } = req.body

        console.log("Reset attempt:", { email, token, newPassword }) // debug

        if (!email || !token || !newPassword) {
            throw new Error("All fields are required")
        }

        const user = await userModel.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        })

        console.log("User found:", user ? "YES" : "NO") // debug

        if (!user) {
            throw new Error("Invalid or expired reset link. Please request a new one.")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // Using updateOne instead of user.save() to bypass Mongoose validation
        // on corrupted fields (like createdAt stored as string in MongoDB)
        await userModel.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetPasswordToken: "", resetPasswordExpiry: "" }
            }
        )

        res.json({
            success: true,
            message: "Password reset successfully! You can now login with your new password."
        })

    } catch (err) {
        console.log("resetPassword error:", err.message) // debug
        res.status(400).json({ success: false, error: true, message: err.message || "Something went wrong" })
    }
}

module.exports = resetPasswordController 