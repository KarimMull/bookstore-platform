import api from './axios';

export const getCart = () => api.get('/cart');
export const addToCart = (bookId, quantity) => api.post('/cart/items', { bookId, quantity });
export const removeFromCart = (itemId) => api.delete(`/cart/items/${itemId}`);
export const clearCart = () => api.delete('/cart');
