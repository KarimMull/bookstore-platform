import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBook } from '../api/books';
import { addToCart } from '../api/cart';
import { getComments, createComment, deleteComment } from '../api/comments';
import { useAuth } from '../context/AuthContext';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    if (id) {
      loadBook();
      loadComments();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const res = await getBook(id);
      setBook(res.data);
    } catch (err) {
      setError('Книга не найдена');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await getComments(id);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setComments([]);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setAddingToCart(true);
      await addToCart(parseInt(id), quantity);
      setCartMessage(`✅ "${book.title}" добавлена в корзину!`);
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err) {
      setCartMessage('❌ Ошибка при добавлении в корзину');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!commentText.trim()) {
      setCommentError('Напишите комментарий');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError('');
      await createComment({
        book_id: parseInt(id),
        text: commentText,
        rating: commentRating,
      });
      setCommentText('');
      setCommentRating(5);
      await loadComments();
    } catch (err) {
      setCommentError('Ошибка при отправке комментария');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const averageRating = comments.length > 0 
    ? (comments.reduce((sum, c) => sum + (c.rating || 5), 0) / comments.length).toFixed(1)
    : 0;

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error">Книга не найдена</div>;

  return (
    <div className="book-detail-container">
      <div className="book-detail-top">
        <Link to="/books" className="back-link">← Назад к каталогу</Link>
      </div>

      <div className="book-detail-main">
        <div className="book-detail-cover">
          <div className="book-cover-large">📚</div>
        </div>
        
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p className="book-detail-author">✍️ {book.author}</p>
          
          <div className="book-detail-rating">
            <span className="rating-stars">
              {'⭐'.repeat(Math.min(Math.round(averageRating || 5), 5))}
            </span>
            <span className="rating-count">({comments.length} отзывов)</span>
          </div>
          
          <div className="book-detail-price-row">
            <span className="book-detail-price">💰 {book.price?.toFixed(2)} ₽</span>
            <span className="book-detail-stock">📦 В наличии: {book.stock || 0} шт.</span>
          </div>
          
          {book.description && (
            <div className="book-detail-description">
              <h3>Описание</h3>
              <p>{book.description}</p>
            </div>
          )}
          
          <div className="book-detail-cart">
            <div className="quantity-selector">
              <label>Количество:</label>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
              >−</button>
              <span className="qty-value">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(book.stock || 99, quantity + 1))}
                className="qty-btn"
              >+</button>
            </div>
            
            <button 
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={addingToCart || (book.stock || 0) === 0}
            >
              {addingToCart ? '⏳ Добавление...' : (book.stock === 0 ? '❌ Нет в наличии' : '🛒 Добавить в корзину')}
            </button>
            
            {cartMessage && (
              <div className={`cart-message ${cartMessage.includes('✅') ? 'success' : 'error'}`}>
                {cartMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* КОММЕНТАРИИ */}
      <div className="comments-section">
        <div className="comments-header">
          <h2>💬 Отзывы и комментарии ({comments.length})</h2>
          {comments.length > 0 && (
            <div className="comments-summary">
              <span className="summary-rating">
                {'⭐'.repeat(Math.min(Math.round(averageRating), 5))}
              </span>
              <span className="summary-average">{averageRating} из 5</span>
            </div>
          )}
        </div>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="comment-form-row">
              <div className="comment-rating">
                <label>Оценка:</label>
                <select 
                  value={commentRating} 
                  onChange={(e) => setCommentRating(parseInt(e.target.value))}
                >
                  <option value={5}>⭐ 5</option>
                  <option value={4}>⭐ 4</option>
                  <option value={3}>⭐ 3</option>
                  <option value={2}>⭐ 2</option>
                  <option value={1}>⭐ 1</option>
                </select>
              </div>
            </div>
            <div className="comment-input-group">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Поделитесь своим мнением о книге..."
                rows="3"
              />
              <button type="submit" disabled={submittingComment} className="btn-submit-comment">
                {submittingComment ? '⏳ Отправка...' : '✉️ Отправить'}
              </button>
            </div>
            {commentError && <div className="comment-error">{commentError}</div>}
          </form>
        ) : (
          <p className="login-to-comment">
            <Link to="/login">Войдите</Link>, чтобы оставить комментарий
          </p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">Пока нет отзывов. Будьте первым!</p>
          ) : (
            <>
              {displayedComments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">👤 {comment.user?.name || 'Пользователь'}</span>
                    <span className="comment-rating-display">
                      {'⭐'.repeat(Math.min(comment.rating || 5, 5))}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    {user?.id === comment.user_id && (
                      <button 
                        className="comment-delete"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
              {comments.length > 3 && (
                <button 
                  className="btn-show-comments"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments ? '🔼 Скрыть комментарии' : `📖 Показать все (${comments.length - 3} ещё)`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
