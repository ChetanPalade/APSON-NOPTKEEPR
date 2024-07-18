// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  backgroundColor: String,
  archived: Boolean,
  deletedAt: Date,
  reminder: Date,
  userId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Note', noteSchema);
