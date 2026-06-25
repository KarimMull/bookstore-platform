import axios from "axios";

const API_URL = "/api";

export const getBooks = async () => {
  const res = await axios.get(`${API_URL}/books`);
  return res.data;
};

export const getBook = async (id) => {
  const res = await axios.get(`${API_URL}/books/${id}`);
  return res.data;
};

export const createBook = async (book) => {
  const res = await axios.post(`${API_URL}/books`, book);
  return res.data;
};
