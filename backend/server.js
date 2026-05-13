const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const entriesRoutes = require('./routes/entriesRoutes');
const exitsRoutes = require('./routes/exitsRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json({ limit: '50mb' }));

app.use('/auth', authRoutes);

app.use('/entries', entriesRoutes);

app.use('/exits', exitsRoutes);

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en puerto ${PORT}`
  );
});