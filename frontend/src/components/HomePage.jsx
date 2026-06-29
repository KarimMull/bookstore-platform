import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBooks } from '../api/books';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      loadSearchResults();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      const res = await getBooks();
      const books = res.data || [];
      setAllBooks(books);
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBookClick = (bookId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="homepage">
      {/* HERO СЕКЦИЯ С ПОИСКОМ */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>📚 На крыльях счастливого детства</h1>
            <p className="hero-subtitle">
              Издательство, которое растёт вместе с ребёнком.
              <br />
              <span className="discount-badge">🔥 Скидка 30% на книги от Феникс-Премьер</span>
            </p>
            
            {/* ПОИСКОВАЯ СТРОКА */}
            <div className="search-container">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="🔍 Поиск книг по названию или автору..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">Найти</button>
              </form>
              
              {/* Результаты поиска */}
              {showResults && searchQuery.length > 0 && (
                <div className="search-results">
                  {loading ? (
                    <div className="search-loading">Поиск...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="search-empty">Книги не найдены</div>
                  ) : (
                    searchResults.slice(0, 5).map(book => (
                      <div 
                        key={book.id} 
                        className="search-result-item"
                        onClick={() => handleBookClick(book.id)}
                      >
                        <span className="search-result-icon">📖</span>
                        <div className="search-result-info">
                          <span className="search-result-title">{book.title}</span>
                          <span className="search-result-author">{book.author}</span>
                          <span className="search-result-price">{book.price} ₽</span>
                        </div>
                      </div>
                    ))
                  )}
                  {searchResults.length > 5 && (
                    <div className="search-more">
                      <Link to={`/books?search=${encodeURIComponent(searchQuery)}`}>
                        Показать все ({searchResults.length})
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="hero-buttons">
              <Link to="/books" className="btn-hero-primary">📖 Перейти в каталог</Link>
              {!user ? (
                <>
                  <Link to="/register" className="btn-hero-secondary">Присоединиться</Link>
                  <Link to="/login" className="btn-hero-secondary">Войти</Link>
                </>
              ) : (
                <Link to="/cart" className="btn-hero-secondary">🛒 Корзина</Link>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-book-stack">
              <span className="book-emoji">📖</span>
              <span className="book-emoji">📚</span>
              <span className="book-emoji">📕</span>
              <span className="book-emoji">📗</span>
            </div>
          </div>
        </div>
      </section>

      {/* КАТЕГОРИИ */}
      <section className="categories">
        <div className="categories-grid">
          <Link to="/books" className="category-card">
            <span className="category-icon">📚</span>
            <h3>Подобрать по возрасту</h3>
            <p>12+</p>
          </Link>
          <Link to="/books" className="category-card">
            <span className="category-icon">🎁</span>
            <h3>Гид по подаркам</h3>
            <p>Настольный клуб</p>
          </Link>
          <Link to="/books" className="category-card">
            <span className="category-icon">⭐</span>
            <h3>30 лучших книг</h3>
            <p>За последние 30 лет</p>
          </Link>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Книгол®</h3>
            <p>Получайте кешбэк до 15% с каждой покупки</p>
          </div>
          <div className="feature-card highlight">
            <div className="feature-icon">🎁</div>
            <h3>Книга в подарок</h3>
            <p>Выберите сюрприз, а мы сами доставим, куда нужно</p>
            <Link to="/books" className="feature-link">Подробнее →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Бесплатная доставка</h3>
            <p>При заказе от 2000 ₽</p>
          </div>
        </div>
      </section>

      {/* РЕКОМЕНДАЦИИ */}
      <section className="recommendations">
        <h2>🌟 Сегодня в ваших рекомендациях</h2>
        <div className="recommendations-grid">
          <Link to="/books" className="rec-card">
            <div className="rec-cover">📘</div>
            <h4>Приключения Тома Сойера</h4>
            <p className="rec-author">Марк Твен</p>
            <p className="rec-price">490 ₽</p>
          </Link>
          <Link to="/books" className="rec-card">
            <div className="rec-cover">📙</div>
            <h4>Маленький принц</h4>
            <p className="rec-author">Антуан де Сент-Экзюпери</p>
            <p className="rec-price">350 ₽</p>
          </Link>
          <Link to="/books" className="rec-card">
            <div className="rec-cover">📕</div>
            <h4>Гарри Поттер и философский камень</h4>
            <p className="rec-author">Дж.К. Роулинг</p>
            <p className="rec-price">590 ₽</p>
          </Link>
          <Link to="/books" className="rec-card">
            <div className="rec-cover">📗</div>
            <h4>Винни-Пух</h4>
            <p className="rec-author">Алан Милн</p>
            <p className="rec-price">420 ₽</p>
          </Link>
        </div>
      </section>

      {/* ПОДВАЛ */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>📚 Bookstore</h4>
            <p>Книги для всей семьи</p>
          </div>
          <div className="footer-section">
            <h4>Контакты</h4>
            <p>📧 info@bookstore.ru</p>
            <p>📞 +7 (800) 123-45-67</p>
          </div>
          <div className="footer-section">
            <h4>Мы в соцсетях</h4>
            <p>📱 Telegram · VK · YouTube</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Bookstore. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
