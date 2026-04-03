import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { getOffers, getProductById, getProducts, getTrending, request } from "./lib/api";
import { storage } from "./lib/storage";
import AuthPage from "./pages/AuthPage";
import FeedbackPage from "./pages/FeedbackPage";
import HomePage from "./pages/HomePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListingPage from "./pages/ProductListingPage";
import WholesalePage from "./pages/WholesalePage";

const initialFilters = {
  search: "",
  category: "All",
  price: "all",
  rating: "0"
};

const decodePrice = (range) => {
  if (range === "0-25") return [0, 25];
  if (range === "25-40") return [25, 40];
  if (range === "40-80") return [40, 80];
  return [0, Infinity];
};

const filterProductList = (items, filters) => {
  const [minPrice, maxPrice] = decodePrice(filters.price);

  return items.filter((product) => {
    const matchesSearch =
      !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === "All" || product.category === filters.category;
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesRating = product.rating >= Number(filters.rating || 0);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });
};

function ProductDetailRoute({ onAddToCart, onReviewSubmit, product, setProduct }) {
  const { id } = useParams();

  useEffect(() => {
    setProduct(null);
    getProductById(id).then(setProduct);
  }, [id, setProduct]);

  return <ProductDetailPage product={product} onAddToCart={onAddToCart} onReviewSubmit={onReviewSubmit} />;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [offers, setOffers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => storage.read("beauty-cart", []));
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useState(() => storage.read("beauty-auth", null));
  const [authMode, setAuthMode] = useState("login");
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    getProducts().then(setProducts);
    getTrending().then(setTrending);
    getOffers().then(setOffers);
  }, []);

  useEffect(() => {
    storage.write("beauty-cart", cart);
  }, [cart]);

  useEffect(() => {
    storage.write("beauty-auth", auth);
  }, [auth]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!auth?.token || !auth?.user?.id) {
        setOrders([]);
        return;
      }

      try {
        const userOrders = await request("/orders", {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setOrders(userOrders);
        storage.write(`beauty-orders-${auth.user.id}`, userOrders);
      } catch (error) {
        setOrders(storage.read(`beauty-orders-${auth.user.id}`, []));
      }
    };

    loadOrders();
  }, [auth]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (location.pathname === "/products" && category) {
      setFilters((current) => ({ ...current, category }));
    }
  }, [location.pathname, searchParams]);

  const filteredProducts = filterProductList(products, filters);
  const filteredOffers = filterProductList(offers, filters);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const placeOrder = async () => {
    if (!cart.length) return;

    if (!auth?.token) {
      setMessage("Please login or register with your contact details before placing an order.");
      setCartOpen(false);
      navigate("/auth");
      return;
    }

    if (!auth?.user?.phone || !auth?.user?.address || !auth?.user?.city || !auth?.user?.email) {
      setMessage("Your saved login is missing delivery details. Please log out and login again before placing an order.");
      setCartOpen(false);
      navigate("/auth");
      return;
    }

    const payload = {
      items: cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
    };

    try {
      const created = await request("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}
      });
      setOrders((current) => {
        const nextOrders = [created, ...current];
        if (auth?.user?.id) {
          storage.write(`beauty-orders-${auth.user.id}`, nextOrders);
        }
        return nextOrders;
      });
      setMessage("Order placed successfully.");
    } catch (error) {
      setMessage(error.message || "We could not place the order.");
      return;
    }

    setCart([]);
    setCartOpen(false);
    navigate("/orders");
  };

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleLogout = () => {
    setAuth(null);
    setOrders([]);
    setMessage("You have been logged out.");
    navigate("/");
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await request(`/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setAuth(data);
      setMessage(
        authMode === "login"
          ? `Welcome back, ${data.user.name}. Your saved delivery details are ready for checkout.`
          : `Account created for ${data.user.name}. You can now place orders with your saved contact details.`
      );
      form.reset();
      navigate("/");
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Could not reach the backend. Make sure the API server is running and allowed by CORS."
          : error.message || "Could not authenticate."
      );
    }
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await request("/feedback", { method: "POST", body: JSON.stringify(payload) });
      setMessage("Feedback sent. Thank you for sharing it.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage("Feedback saved locally in the UI flow.");
    }
  };

  const handleWholesaleSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await request("/feedback/wholesale", { method: "POST", body: JSON.stringify(payload) });
      setMessage("Thank you for your wholesale request. We will connect you soon.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage("Thank you for your wholesale request. We will connect you soon.");
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProduct) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      userName: formData.get("userName"),
      rating: Number(formData.get("rating")),
      comment: formData.get("comment")
    };

    try {
      const review = await request(`/reviews/${selectedProduct.id}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setSelectedProduct((current) => ({
        ...current,
        reviews: [review, ...(current.reviews || [])]
      }));
      form.reset();
    } catch (error) {
      setSelectedProduct((current) => ({
        ...current,
        reviews: [{ id: `local-${Date.now()}`, ...payload }, ...(current.reviews || [])]
      }));
      form.reset();
    }
  };

  const hasCheckoutProfile = Boolean(auth?.user?.phone && auth?.user?.address && auth?.user?.city && auth?.user?.email);
  const checkoutLabel = !auth?.token ? "Login to Continue" : hasCheckoutProfile ? "Place Order" : "Refresh Account Details";
  const checkoutHint = !cart.length
    ? "Add products to your cart to continue."
    : !auth?.token
      ? "Login or register before checkout so we can save your contact and delivery details."
      : hasCheckoutProfile
        ? "Your account details are ready. You can place the order now."
        : "Your saved session is missing delivery details. Log out and login again before checkout.";

  return (
    <div className="app-shell">
      <Navbar
        onCartOpen={() => setCartOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        authUser={auth?.user}
        onLogout={handleLogout}
      />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onCheckout={placeOrder}
        onRemoveItem={removeFromCart}
        checkoutLabel={checkoutLabel}
        checkoutHint={checkoutHint}
      />

      {message ? <div className="app-message">{message}</div> : null}

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage trending={trending} offers={offers} onAddToCart={addToCart} />} />
          <Route
            path="/products"
            element={
              <ProductListingPage
                products={filteredProducts}
                filters={filters}
                onFilterChange={handleFilterChange}
                onAddToCart={addToCart}
                title="All Products"
                copy="Mobile-first browsing with category, price, and rating filters."
              />
            }
          />
          <Route
            path="/offers"
            element={
              <ProductListingPage
                products={filteredOffers}
                filters={filters}
                onFilterChange={handleFilterChange}
                onAddToCart={addToCart}
                title="Offer Products"
                copy="Current value sets and promotional picks."
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetailRoute
                onAddToCart={addToCart}
                onReviewSubmit={handleReviewSubmit}
                product={selectedProduct}
                setProduct={setSelectedProduct}
              />
            }
          />
          <Route
            path="/auth"
            element={
              auth?.token ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage mode={authMode} onModeChange={setAuthMode} onSubmit={handleAuthSubmit} message={message} />
              )
            }
          />
          <Route path="/orders" element={<OrderHistoryPage orders={orders} />} />
          <Route path="/feedback" element={<FeedbackPage onSubmit={handleFeedbackSubmit} message={message} />} />
          <Route path="/wholesale" element={<WholesalePage onSubmit={handleWholesaleSubmit} message={message} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
