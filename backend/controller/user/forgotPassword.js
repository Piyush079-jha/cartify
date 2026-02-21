const userModel = require("../../models/userModel")
const nodemailer = require("nodemailer")
const crypto = require("crypto")

async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body

        if (!email) throw new Error("Email is required")

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({
                success: true,
                message: "If this email exists, a reset link has been sent."
            })
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetTokenExpiry = Date.now() + 60 * 60 * 1000

        await userModel.updateOne(
            { _id: user._id },
            { 
                $set: {
                    resetPasswordToken: resetToken,
                    resetPasswordExpiry: new Date(resetTokenExpiry)
                }
            }
        )

        const resetLink = process.env.FRONTEND_URL + "/reset-password?token=" + resetToken + "&email=" + encodeURIComponent(email)
        const userName = user.name

        // Using Gmail directly — no Brevo needed
        // const transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: "piyushjha134@gmail.com",
        //         pass: process.env.GMAIL_APP_PASSWORD
        //     }
        // })
        const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "piyushjha1134@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD
    }
})

        const htmlContent = '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:16px;">'
            + '<h1 style="color:#667eea;text-align:center;">Cartify</h1>'
            + '<h2 style="color:#1a1a2e;">Reset Your Password</h2>'
            + '<p style="color:#555;font-size:15px;line-height:1.6;">Hi <strong>' + userName + '</strong>,<br/>Click the button below to reset your password.</p>'
            + '<a href="' + resetLink + '" style="display:inline-block;padding:14px 32px;background:#667eea;color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;">Reset Password</a>'
            + '<p style="color:#aaa;font-size:13px;margin-top:16px;">This link expires in 1 hour. If you did not request this, ignore this email.</p>'
            + '</div>'

        await transporter.sendMail({
            from: '"Cartify Shop" <piyushjha134@gmail.com>',
            to: email,
            subject: "Reset Your Password - Cartify",
            html: htmlContent
        })

        res.json({ success: true, message: "Password reset link sent to your email!" })

    } catch (err) {
        console.log("forgotPassword error:", err)
        res.status(400).json({ success: false, error: true, message: err.message || "Something went wrong" })
    }
}

module.exports = forgotPasswordController