const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const ahorrosRoutes = require('./routes/ahorros.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API MEAN Meta Ahorro funcionando');
});

app.use('/api/ahorros', ahorrosRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log('✅ MongoDB Atlas conectado');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error MongoDB:', error.message);
    process.exit(1);
  });
