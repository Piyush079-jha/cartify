const Groq = require("groq-sdk")
const productModel = require("../../models/productModel")

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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

        const messages = [
            {
                role: "system",
                content: `You are a helpful shopping assistant for Cartify, an e-commerce store selling electronics.

Available products (with links):
${productContext}

Store policies:
- Free delivery on orders above ₹999
- Easy 7-day returns
- Secure payment methods
- Cash on delivery available

IMPORTANT INSTRUCTIONS:
- When recommending products, ALWAYS include their link in this exact format: [Product Name](/product/ID)
- Always mention the price when recommending a product
- Be friendly, concise and helpful. Max 3-4 sentences per response.
- If multiple products match, list up to 3 with their links and prices.`
            },
            ...history.map(msg => ({
                role: msg.role,
                content: msg.text
            })),
            { role: "user", content: message }
        ]

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
            messages: messages,
            max_tokens: 500
        })

        const response = completion.choices[0].message.content

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
