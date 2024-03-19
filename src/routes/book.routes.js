const express = require("express");
const router = express.Router();
const Book = require("../models/book.model.js");

//Middleware
const getBook = async (req, resp, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ message: "El id del libro no es valido" });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        message: "El libro no fue encontrado",
      });
    }
    res.book = book;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Obtener todos los libros

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    console.log("GET ALL", books);
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Crear un nuevo libro

router.post("/", async (req, res) => {
  const { title, author, gender, publication_date } = req?.body;
  if (!title || !author || !gender || !publication_date) {
    return res.status(400).json({ message: "Los campos son obligatorio" });
  }

  const book = new Book({
    title,
    author,
    gender,
    publication_date,
  });

  try {
    const newBook = await book.save;
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
