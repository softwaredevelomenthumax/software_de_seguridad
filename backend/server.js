const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const entriesRoutes = require('./routes/entriesRoutes');
const exitsRoutes = require('./routes/exitsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/entries', entriesRoutes);
app.use('/exits', exitsRoutes);

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

app.listen(3000, () => {
  console.log('Servidor ejecutándose en puerto 3000');
});
