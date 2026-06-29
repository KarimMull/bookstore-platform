import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, removeFromCart, clearCart, updateCartItem } from '../api/cart';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Не удалось загрузить корзину');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(itemId);
      return;
    }
    
    try {
      setUpdating(true);
      await updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (err) {
      alert('Ошибка при обновлении количества');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (itemId) => {
    if (!window.confirm('Удалить товар из корзины?')) return;
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Очистить корзину?')) return;
    try {
      await clearCart();
      await loadCart();
    } catch (err) {
      alert('Ошибка при очистке');
    }
  };

  if (!user) {
    return (
      <div className="cart-container">
        <h2>🛒 Корзина</h2>
        <p className="empty-cart">Войдите, чтобы увидеть корзину</p>
        <Link to="/login" className="btn-login-cart">Войти</Link>
      </div>
    );
  }

  if (loading) return <div className="loading">Загрузка корзины...</div>;
  if (error) return <div className="error">{error}</div>;
  
  if (!cart || cart.items?.length === 0) {
    return (
      <div className="cart-container">
        <h2>🛒 Корзина</h2>
        <div className="empty-cart">
          <span className="empty-cart-icon">🛒</span>
          <p>Ваша корзина пуста</p>
          <Link to="/books" className="btn-continue-shopping">Продолжить покупки</Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Корзина</h2>
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-book">
              <span className="cart-item-cover">📚</span>
              <div className="cart-item-info">
                <h4>{item.book.title}</h4>
                <p className="cart-item-author">✍️ {item.book.author}</p>
                <p className="cart-item-price">💰 {item.book.price} ₽</p>
              </div>
            </div>
            
            <div className="cart-item-actions">
              <div className="cart-quantity">
                <button 
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={updating}
                  className="qty-btn-cart"
                >−</button>
                <span className="qty-value-cart">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={updating}
                  className="qty-btn-cart"
                >+</button>
              </div>
              <p className="cart-item-subtotal">{(item.book.price * item.quantity).toFixed(2)} ₽</p>
              <button 
                className="btn-remove-cart"
                onClick={() => handleRemove(item.id)}
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Итого:</span>
          <span className="cart-total">{total.toFixed(2)} ₽</span>
        </div>
        <div className="cart-summary-row">
          <span>Доставка:</span>
          <span className="cart-delivery">Бесплатно</span>
        </div>
        <div className="cart-summary-divider"></div>
        <div className="cart-summary-row total">
          <span>К оплате:</span>
          <span className="cart-grand-total">{total.toFixed(2)} ₽</span>
        </div>
        
        <div className="cart-actions">
          <Link to="/books" className="btn-continue">Продолжить покупки</Link>
          <button className="btn-checkout-cart" onClick={() => alert('Оформление заказа')}>
            📦 Оформить заказ
          </button>
          <button className="btn-clear-cart" onClick={handleClear}>
            Очистить корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
