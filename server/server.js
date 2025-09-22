require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

require('./cronJobs');

// Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/market', require('./routes/market'));

app.use('/api/crops', require('./routes/crop'));

app.use('/api/notifications', require('./routes/notification'));

app.use('/api/transactions', require('./routes/transaction'));

app.use('/api/leaderboard', require('./routes/leaderboard'));

app.get('/', (req, res) => {
  res.send('Farmverse server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
