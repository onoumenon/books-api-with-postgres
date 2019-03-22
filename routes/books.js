const uuid = require("uuid/v4");
const express = require("express");
const router = express.Router();
const { books: oldBooks } = require("../data/db.json");
const { Book, Author } = require("../Models");

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(403);
  } else {
    if (authorization === "Bearer my-awesome-token") {
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { author, title } = req.query;

      if (title) {
        const books = await Book.findAll({
          where: { title },
          include: [Author]
        });
        return res.json(books);
      } else if (author) {
        const books = await Book.findAll({
          include: [{ model: Author, where: { name: author } }]
        });
        return res.json(books);
      } else {
        const books = await Book.findAll({ include: [Author] });
        return res.json(books);
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const { title, author } = req.body;
      // Alternative method uses include
      // First Method: findorCreate returns an array with the obj + boolean
      const [foundAuthor] = await Author.findOrCreate({
        where: { name: author }
      });
      const newBook = await Book.create({ title });
      await newBook.setAuthor(foundAuthor);
      const updatedBook = await Book.findOne({
        where: { id: newBook.id },
        include: [Author]
      });
      return res.status(201).json(updatedBook);
    } catch (err) {
      return res.status(400).json(err);
    }
  });

router
  .route("/:id")
  .put(async (req, res) => {
    try {
      const book = await Book.findOne({
        where: { id: req.body.id },
        include: [Author]
      });

      const [foundAuthor] = await Author.findOrCreate({
        where: { name: req.body.author }
      });

      const newBook = await book.update({ title: req.body.title });
      await newBook.setAuthor(foundAuthor);

      const result = await Book.findOne({
        where: { id: req.body.id },
        include: [Author]
      });

      return res.status(202).json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  })
  .delete((req, res) => {
    const book = oldBooks.find(b => b.id === req.params.id);
    if (book) {
      res.sendStatus(202);
    } else {
      res.sendStatus(400);
    }
  });

module.exports = router;
