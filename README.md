# 🛒 Cartify — E-Commerce Web App

Cartify is a full-stack e-commerce app I built using the MERN stack. It has everything you'd expect from a real shopping platform — browsing products, adding to cart, wishlist, payments, and even an AI shopping assistant powered by Google Gemini.

🔗 **Live Demo:** https://cartifyy-orpin.vercel.app/

---

## ✨ What it can do

- You can sign up, log in, and reset your password securely using JWT authentication
- Browse and filter products by category, search for anything, and sort by price
- Add products to your cart or save them to your wishlist for later
- Complete purchases using Credit/Debit Card, UPI, Net Banking, or Cash on Delivery
- Chat with an AI shopping assistant that helps you find the right product
- Leave reviews and ratings on products you've bought
- Switch between light and dark mode
- Admins have a separate panel to manage products and users

---

## 🧰 Tech Stack

**Frontend:** React.js, Redux Toolkit, Tailwind CSS, React Router  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT  
**AI:** Google Gemini API  
**Deployment:** Vercel (Frontend), Render (Backend)

---

## 🚀 Deployed on Vercel

The frontend is live on Vercel. If you want to deploy your own copy, here's how:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com), create a new project and import your repo
3. Set the root directory to `frontend`
4. Add your backend URL as an environment variable:

```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

5. Hit deploy and you're done!

For the backend, I recommend deploying on **Render** — it's free and works great with Node.js apps.

---

## ⚙️ Running it locally

```bash
# Clone the repo
git clone https://github.com/Piyush079-jha/Full-Stack-E-Commerce-MERN-APP.git

# Start the backend
cd backend
npm install
npm run dev

# Start the frontend (open a new terminal)
cd frontend
npm install
npm start
```

Create a `.env` file inside the `backend` folder with these values:

```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/cartify
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 👨‍💻 About Me

Hi, I'm **Piyush Jha** — a passionate full-stack developer from India who loves turning ideas into real, working products. I built Cartify from scratch to sharpen my MERN skills and explore how AI can be integrated into everyday apps. If you found this project useful, a ⭐ on the repo would mean a lot! And if you want to connect, collaborate, or just say hi — I'm always up for it. 🙌

<br/>

<a href="https://github.com/Piyush079-jha" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-Piyush079--jha-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
&nbsp;&nbsp;
<a href="https://www.linkedin.com/in/piyush-jha1134/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-Piyush%20Jha-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>

---

> Built with ❤️ using MERN Stack
