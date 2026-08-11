import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Product from "../features/products/pages/Product";
import ProductDetail from "../features/products/pages/ProductDetail";
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/checkout/pages/Checkout";
import AuthLayout from "../layouts/AuthLayout";
import Profile from "../features/profile/pages/Profile";
import Order from "../features/order/pages/Order";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Product />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/orders",
        element: <Order />,
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/checkout/:id",
    element: <Checkout />,
  },
]);

export default router;
