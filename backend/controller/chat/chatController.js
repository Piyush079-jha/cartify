const Groq = require("groq-sdk");
const productModel = require("../../models/productModel");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let cachedContext = null;
let cacheTime = null;

const getProductContext = async () => {
  if (cachedContext && Date.now() - cacheTime < 5 * 60 * 1000) {
    return cachedContext;
  }
  const products = await productModel
    .find({})
    .limit(50)
    .select("_id productName category sellingPrice");
  cachedContext = products
    .map(
      (p) =>
        `- [${p.productName}](/product/${p._id}) | Category: ${p.category} | Price: ₹${p.sellingPrice}`
    )
    .join("\n");
  cacheTime = Date.now();
  return cachedContext;
};

const chatController = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const productContext = await getProductContext();

    const messages = [
      {
        role: "system",
        content: `You are Cartify's friendly shopping assistant for electronics.

Products:
${productContext}

Policies: Free delivery above ₹999, 7-day returns, COD available.

Rules:
- Recommend products with links: [Name](/product/ID) and price
- Max 2-3 sentences per response
- If asked who made Cartify: Piyush Jha

Also handle these naturally:
- Greetings (hi/hello/hey) → greet warmly and introduce yourself
- How are you → say you're doing great and ready to help
- What can you do → explain you help find products, answer questions
- Thank you → respond warmly
- Bye/goodbye → wish them well
- Jokes → tell a short fun tech/shopping joke
- What is Cartify → explain it's an electronics e-commerce store
- Compliments → accept gracefully and offer to help
- Who made Cartify → Piyush Jha
- Random questions → politely say you're specialized for shopping but still try to help`,
      },
      ...history
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => ({
          role: msg.role,
          content: msg.text,
        })),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
      max_tokens: 300,
    });

    const response = completion.choices[0].message.content;

    res.json({ success: true, message: response });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({
      success: false,
      message:
        "Sorry, I'm having trouble responding right now. Please try again.",
    });
  }
};

module.exports = chatController;