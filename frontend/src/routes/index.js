import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassowrd from '../pages/ForgotPassowrd'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import ProtectedRoute from '../components/ProtectedRoute'
import Wishlist from '../pages/wishlist'
import ResetPassword from '../pages/ResetPassword'
import Payment from '../pages/Payment'
import OrderTracking from '../pages/OrderTracking'   

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            { path : "", element : <Home/> },
            { path : "login", element : <Login/> },
            { path : "forgot-password", element : <ForgotPassowrd/> },
            { path : "reset-password", element : <ResetPassword/> },
            { path : "sign-up", element : <SignUp/> },
            { path : "product-category", element : <CategoryProduct/> },
            { path : "product/:id", element : <ProductDetails/> },
            { path : 'cart', element : <Cart/> },
            { path : "search", element : <SearchProduct/> },
            { path : "wishlist", element : <Wishlist/> },
            { path : "payment", element : <Payment/> },
            { path : "my-orders", element : <OrderTracking/> },   // ✅ NEW
            {
                path : "admin-panel",
                element : (
                    <ProtectedRoute>
                        <AdminPanel/>
                    </ProtectedRoute>
                ),
                children : [
                    { path : "all-users", element : <AllUsers/> },
                    { path : "all-products", element : <AllProducts/> }
                ]
            },
        ]
    }
])

export default router