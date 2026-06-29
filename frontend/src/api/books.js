import api from './axios';

export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
export const uploadBookImage = (id, formData) => api.post(`/books/${id}/image`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
