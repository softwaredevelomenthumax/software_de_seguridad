const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const entriesRoutes = require('./routes/entriesRoutes');
const exitsRoutes = require('./routes/exitsRoutes');
const collaboratorsRoutes = require('./routes/collaboratorsRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

app.use('/auth', authRoutes);

app.use('/entries', entriesRoutes);

app.use('/exits', exitsRoutes);

app.use('/collaborators', collaboratorsRoutes);

app.get('/health', (req, res) => {
  res.send('Backend funcionando 🚀');
});

const frontendDist = path.join(__dirname, '..', 'dist');

app.use(express.static(frontendDist));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log('Servidor activo');
});
