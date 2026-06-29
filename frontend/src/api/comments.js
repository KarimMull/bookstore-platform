import api from './axios';

export const getComments = (bookId) => api.get(`/auth/comments/book/${bookId}`);
export const createComment = (data) => api.post('/auth/comments', data);
export const deleteComment = (id) => api.delete(`/auth/comments/${id}`);
