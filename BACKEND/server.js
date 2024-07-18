const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const mongoose = require('./server/config/db');

app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
