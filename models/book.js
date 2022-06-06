const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
}, { collection: 'dataItems' });

module.exports = mongoose.model('Book', bookSchema);
