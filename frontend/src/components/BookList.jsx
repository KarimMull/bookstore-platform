import { useEffect, useState } from "react";
import { getBooks } from "../api/books";

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Book Catalog</h1>

      <div style={{ display: "grid", gap: "10px" }}>
        {books.map((b) => (
          <div key={b.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h3>{b.title}</h3>
            <p>Author: {b.author}</p>
            <p>Price: ${b.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
