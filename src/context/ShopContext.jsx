import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import * as api from '../services/api';

const ShopContext = createContext();

/* Page name → URL. The old `navigateToPage('warranty')` style calls are kept
   working so no component had to change when real routing was introduced. */
const PATHS = {
  home: '/',
  shop: '/shop',
  about: '/about',
  contact: '/contact',
  customise: '/customise',
  warranty: '/warranty',
  lifetime: '/warranty',
  delivery: '/delivery',
  shipping: '/delivery',
  returns: '/returns',
  return: '/returns',
};

/** URL → page name, for components that highlight the active nav item. */
const pageFromPath = (pathname) => {
  if (pathname === '/') return 'home';
  const segment = pathname.split('/')[1] || 'home';
  if (segment === 'product') return 'product';
  return segment;
};

export const ShopProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage = pageFromPath(location.pathname);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ── Live catalog & store settings (backend) ──────────────────────
  // Starts with the bundled catalog so the first paint is never empty,
  // then swaps in whatever the API returns.
  const [products, setProducts] = useState(PRODUCTS);
  const [catalogSource, setCatalogSource] = useState('static');
  const [productsLoading, setProductsLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [curtainLoaderActive, setCurtainLoaderActive] = useState(true);

  // Fly-to-cart state
  const [flyItem, setFlyItem]   = useState(null);
  const cartIconRef             = useRef(null); // Navbar registers the cart button here

  const replayCurtainLoader = () => {
    setCurtainLoaderActive(true);
  };

  /** Pulls the catalog from the backend; keeps the bundled one if it is down. */
  const refreshProducts = async () => {
    setProductsLoading(true);
    try {
      const { products: live, source } = await api.getProducts();
      setProducts(live);
      setCatalogSource(source);
      setMaintenance(null);
    } catch (error) {
      // A 503 means the admin switched maintenance mode on.
      if (error.maintenance) setMaintenance(error.data || { title: error.message });
    } finally {
      setProductsLoading(false);
    }
  };

  /** Maintenance page copy and the announcement bar text, both admin-editable. */
  const refreshSettings = async () => {
    try {
      const live = await api.getPublicSettings();
      setSettings(live);
      setMaintenance(live.maintenance?.enabled ? live.maintenance : null);
      return live;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    refreshSettings().then((live) => {
      // Skip the catalog call while the store is closed for maintenance.
      if (live?.maintenance?.enabled) {
        setProductsLoading(false);
        return;
      }
      refreshProducts();
    });
  }, []);

  /** Keeps `selectedProduct` pointing at the live copy after a refresh. */
  useEffect(() => {
    if (!selectedProduct) return;
    const fresh = products.find((p) => p.id === selectedProduct.id);
    if (fresh && fresh !== selectedProduct) setSelectedProduct(fresh);
  }, [products]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Trigger the fly-to-cart animation
  const triggerFlyToCart = ({ image, fromRect }) => {
    if (!cartIconRef.current) return;
    const toRect = cartIconRef.current.getBoundingClientRect();
    setFlyItem({ image, fromRect, toRect });
  };

  const clearFlyItem = () => setFlyItem(null);

  const addToCart = (product, metal = "18K Yellow Gold", size = "7", qty = 1) => {
    // The admin panel can take a piece off sale at any time.
    if (product.isAvailable === false) {
      showToast(`"${product.name}" is currently unavailable`);
      return;
    }
    if (!product.isCustom && product.stock === 0) {
      showToast(`"${product.name}" is out of stock`);
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.metal === metal && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prevCart, { ...product, metal, size, quantity: qty }];
    });
    showToast(`Added "${product.name}" to bag`);
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const updateCartQty = (index, delta) => {
    setCart(prevCart => {
      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prevCart.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Added "${product.name}" to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const navigateToProduct = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (pageName, category = 'ALL') => {
    if (category) setSelectedCategory(category);

    const path = PATHS[pageName] || `/${pageName}`;
    // A category on the shop page becomes part of the URL, so /shop/rings is shareable.
    navigate(
      pageName === 'shop' && category && category !== 'ALL'
        ? `/shop/${category.toLowerCase()}`
        : path
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** Kept for backwards compatibility with anything still setting a page by name. */
  const setActivePage = (pageName) => navigateToPage(pageName);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /**
   * Sends the bag to the backend. Only ids, options and quantities travel —
   * the server prices the order itself, so the amount can never be tampered with.
   */
  const placeOrder = async ({ shippingAddress, couponCode = '', paymentMethod = 'COD', notes = '' }) => {
    const items = cart.map(item => (
      item.customReference
        ? { customRequest: item.customReference, quantity: item.quantity }
        : { productId: item.id, metal: item.metal, size: item.size, quantity: item.quantity }
    ));

    const { order } = await api.createOrder({ items, shippingAddress, couponCode, paymentMethod, notes });

    setCart([]);
    refreshProducts();
    return order;
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        cart,
        cartCount,
        cartTotal,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateCartQty,
        wishlist,
        wishlistOpen,
        setWishlistOpen,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        sizeGuideOpen,
        setSizeGuideOpen,
        navigateToProduct,
        navigateToPage,
        toastMessage,
        showToast,
        curtainLoaderActive,
        setCurtainLoaderActive,
        replayCurtainLoader,
        flyItem,
        clearFlyItem,
        triggerFlyToCart,
        cartIconRef,

        // Backend-driven state
        products,
        productsLoading,
        catalogSource,
        refreshProducts,
        settings,
        refreshSettings,
        maintenance,
        checkoutOpen,
        setCheckoutOpen,
        couponCode,
        setCouponCode,
        placeOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
