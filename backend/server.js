const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myprogress', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Routes
app.use('/api/goals', require('./routes/goals'));
app.use('/api/auth', require('./routes/auth'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: '🚀 API MyProgress Tracker en marche !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Serveur démarré sur le port ${PORT}`);
});