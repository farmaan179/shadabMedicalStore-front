import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("shadab_cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("shadab_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) => i._id === product._id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...product, quantity: qty, selected: true }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i._id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, quantity } : i)));
  };

  const toggleSelect = (id) => {
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, selected: !i.selected } : i)));
  };

  const clearCart = () => setCart([]);
  const clearSelected = () => setCart((prev) => prev.filter((i) => !i.selected));

  const finalPrice = (item) => Math.round(item.price - (item.price * (item.discountPercent || 0)) / 100);

  const selectedItems = cart.filter((i) => i.selected);
  const mrpTotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const finalTotal = selectedItems.reduce((sum, i) => sum + finalPrice(i) * i.quantity, 0);
  const totalSavings = mrpTotal - finalTotal;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, toggleSelect,
      clearCart, clearSelected, selectedItems, mrpTotal, finalTotal,
      totalSavings, totalItems, finalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);