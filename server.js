const express = require('express');
const mongoose = require('mongoose');
const Book = require('./modules/book');
const { builtinModules } = require('module');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/BookStore2', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to local MongoDB');
    app.listen(3001, () => {
      console.log(`Node API app is running on port 3001`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to local MongoDB:', error);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the Online Book Store!');
});

app.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to add book' });
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to fetch books' });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      res.status(404).json({ message: `Book not found with id ${req.params.id}` });
    }
    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to delete book' });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      res.status(404).json({ message: `Book not found with id ${req.params.id}` });
    }
    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update book' });
  }
});
