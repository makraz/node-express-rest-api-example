const express = require('express');
const router = express.Router();
const bookModel = require('../models/book');

router
    .route('/')
    .get(function (request, response) {
        console.log('GET /');
        response.status(200).send({
            'status': 'Success'
        });
    });

router
    .route('/books')
    .post(function (request, response) {
        console.log('POST /books');

        request.body.id = Date.now();

        if (!request.body.title.length || !request.body.description.length) {
            response.status(400).send({
                status: 'Error',
                error: 'Title and Description are required',
            });
            return;
        }

        const book = new bookModel(request.body);

        book.save();

        response.status(201).send({
            'status': 'Success',
            'book': book
        });
    })
    .get(function (request, response) {
        console.log('GET /books');

        bookModel.find(function (error, books) {
            if (error) {
                response.status(500).send({
                    status:'Error',
                    error:error
                });
                return;
            }

            console.log(books);

            response.json({
                status: 'Success',
                books: books,
            });
        });
    });

router
    .route('/books/:bookId')
    .get(function (request, response) {
        console.log('GET /books/:bookId');

        const bookId = request.params.bookId;

        bookModel.findOne({ id: bookId }, function (error, book) {
            if (error) {
                response.status(500).send(error);
                return;
            }

            console.log(book);

            response.json({
                status: 'Success',
                book: book,
            });
        });
    })
    .put(function (request, response) {
        console.log('PUT /books/:bookId');

        const bookId = request.params.bookId;

        bookModel.findOne({ id: bookId }, function (error, book) {
            if (error) {
                response.status(500).send({
                    status: 'Error',
                    error: error
                });
                return;
            }

            if (!request.body.title.length || !request.body.description.length) {
                response.status(400).send({
                    status: 'Error',
                    error: 'Title and Description are required',
                });
                return;
            }

            if (book) {
                book.title = request.body.title;
                book.description = request.body.description;

                book.save();

                response.json({
                    status: 'Success',
                    book: book,
                });
                return;
            }

            response.status(404).json({
                status: 'NotFound.',
                message: 'Book with id ' + bookId + ' was not found.'
            });
        });
    })
    .patch(function (request, response) {
        console.log('PATCH /books/:bookId');

        const bookId = request.params.bookId;

        bookModel.findOne({ id: bookId }, function (error, book) {
            if (error) {
                response.status(500).send({
                    status: 'Error',
                    error: error,
                });
                return;
            }

            if (book) {

                for (const property in request.body) {
                    if (request.body.hasOwnProperty(property)) {
                        if (typeof book[property] !== 'undefined') {
                            book[property] = request.body[property];
                        }
                    }
                }

                if (request.body.title === undefined || request.body.description === undefined) {
                    response.status(400).send({
                        status: 'Error',
                        error: 'Title and Description are required',
                    });
                    return;
                }

                if (request.body.title) {
                  book.title = request.body.title;
                }

                if (request.body.description) {
                  book.description = request.body.description;
                }

                book.save();

                response.json({
                    status: 'Success',
                    book: book,
                });
                return;
            }

            response.status(404).json({
                status: 'NotFound',
                message: 'Book with id ' + bookId + ' was not found.'
            });
        });
    })
    .delete(function (request, response) {
        console.log('DELETE /books/:bookId');

        const bookId = request.params.bookId;

        bookModel.findOne({ id: bookId }, function (error, book) {

            if (error) {
                response.status(500).send({
                    status: 'Error',
                    error: error,
                });
                return;
            }

            if (book) {
                book.remove(function (error) {
                    if (error) {
                        response.status(500).send({
                            status: 'Error',
                            error: error,
                        });
                        return;
                    }

                    response.status(204).json();
                });
            } else {
                response.status(404).json({
                    status: 'NotFound',
                    message: 'Book with id ' + bookId + ' was not found.'
                });
            }
        });
    });

module.exports = router;
