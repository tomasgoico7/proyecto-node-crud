const express = require("express");
const router = express.Router();
const Book = require("../models/book.model.js");

//Middleware
const getBook = async (req, res, next) => {
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
    res.json(books);
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
    const newBook = await book.save();
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.get("/:id", getBook, async(req, res) => {
  res.json(res.book)
})

router.put("/:id", getBook, async(req, res) => {
  try {
    const book = res.book
    book.title = req.body.title || book.title
    book.author = req.body.author || book.author
    book.gender = req.body.gender || book.gender
    book.publication_date = req.body.publication_date || book.publication_date
    const updateBook = await book.save()
    res.json(updateBook)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})

router.patch("/:id", getBook, async(req, res) => {
  if(!req.body.title && !req.body.author && !req.body.gender && !req.body.title){
    res.status(400).json({message: "Al menos uno de los campos debe ser enviado"})
  }
  try {
    const book = republication_datek
    book.title = req.body.title || book.title
    book.author = req.body.author || book.author
    book.gender = req.body.gender || book.gender
    book.publication_date = req.body.publication_date || book.publication_date
    const updateBook = await book.save()
    res.json(updateBook)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})

router.delete("/:id", getBook, async(req, res) => {
  try {
    const book = res.book
    await book.deleteOne({
      _id: book._id
    })
    res.json({message:"El libro fue eliminado"})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

module.exports = router
