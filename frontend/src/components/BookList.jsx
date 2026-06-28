import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook, createBook, updateBook } from '../api/books';
import BookForm from './BookForm';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  const handleSave = async (bookData) => {
    try {
      if (editingBook && editingBook.id) {
        await updateBook(editingBook.id, bookData);
        setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...bookData } : b));
      } else {
        const res = await createBook(bookData);
        setBooks([...books, res.data]);
      }
      setEditingBook(null);
    } catch (err) {
      alert('Failed to save book');
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="book-list-container">
      <div className="header-section">
        <h2>📚 Book List</h2>
        <button className="btn-add" onClick={() => setEditingBook({})}>+ Add Book</button>
      </div>

      {editingBook !== null && (
        <BookForm
          book={editingBook}
          onSave={handleSave}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <div className="book-grid">
        {books.length === 0 ? (
          <p className="empty-message">No books yet. Add your first book!</p>
        ) : (
          books.map(book => (
            <div key={book.id} className="book-card">
              <h3>{book.title}</h3>
              <p className="author">✍️ {book.author}</p>
              <p className="price">💰 ${book.price?.toFixed(2)}</p>
              <p className="stock">📦 Stock: {book.stock || 0}</p>
              <div className="book-actions">
                <button className="btn-edit" onClick={() => setEditingBook(book)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(book.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;
