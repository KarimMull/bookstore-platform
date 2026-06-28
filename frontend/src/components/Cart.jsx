import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, clearCart } from '../api/cart';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all items?')) return;
    try {
      await clearCart();
      await loadCart();
    } catch (err) {
      alert('Failed to clear cart');
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (!cart || cart.items?.length === 0) {
    return <div className="empty-cart">🛒 Your cart is empty</div>;
  }

  const total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.book.title}</h4>
              <p>✍️ {item.book.author}</p>
              <p>💰 ${item.book.price} × {item.quantity}</p>
            </div>
            <button className="btn-remove" onClick={() => handleRemove(item.id)}>🗑️</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <h3>Total: ${total.toFixed(2)}</h3>
        <div className="cart-actions">
          <button className="btn-checkout">📦 Checkout</button>
          <button className="btn-clear" onClick={handleClear}>Clear All</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
