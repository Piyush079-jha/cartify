const { GoogleGenerativeAI } = require("@google/generative-ai")
const productModel = require("../../models/productModel")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Cache product context for 5 minutes to save API quota
let cachedContext = null
let cacheTime = null

const getProductContext = async () => {
    if (cachedContext && Date.now() - cacheTime < 5 * 60 * 1000) {
        return cachedContext
    }
    const products = await productModel.find({}).limit(100).select(
        '_id productName brandName category sellingPrice'
    )
    cachedContext = products.map(p =>
        `- [${p.productName}](/product/${p._id}) by ${p.brandName} | Category: ${p.category} | Price: ₹${p.sellingPrice}`
    ).join('\n')
    cacheTime = Date.now()
    return cachedContext
}

const chatController = async (req, res) => {
    try {
        const { message, history = [] } = req.body

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" })
        }

        const productContext = await getProductContext()

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `You are a helpful shopping assistant for Cartify, an e-commerce store selling electronics.

Available products (with links):
${productContext}

Store policies:
- Free delivery on orders above ₹999
- Easy 7-day returns
- Secure payment methods
- Cash on delivery available

IMPORTANT INSTRUCTIONS:
- When recommending products, ALWAYS include their link in this exact format: [Product Name](/product/ID)
- Example: I recommend the [Apple AirPods Pro 2nd Gen](/product/abc123) at ₹19,900
- Always mention the price when recommending a product
- Be friendly, concise and helpful. Max 3-4 sentences per response.
- If multiple products match, list up to 3 with their links and prices.`
        })

        const chatHistory = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))

        const chat = model.startChat({ history: chatHistory })
        const result = await chat.sendMessage(message)
        const response = result.response.text()

        res.json({ success: true, message: response })

    } catch (error) {
        console.error("Chat error:", error.message)
        res.status(500).json({
            success: false,
            message: "Sorry, I'm having trouble responding right now. Please try again."
        })
    }
}

module.exports = chatController