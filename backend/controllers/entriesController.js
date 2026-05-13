const db = require('../db');

// ==============================
// GET ENTRIES
// ==============================
const getEntries = (req, res) => {
  const sql = 'SELECT * FROM entries ORDER BY id DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

// ==============================
// CREATE ENTRY
// ==============================
const createEntry = (req, res) => {
  const {
    collaboratorId,
    collaboratorName,
    collaboratorDocument,
    objectName,
    objectDescription,
    category,
    photo,
    signature,
    notes,
  } = req.body;

  const sql = `
    INSERT INTO entries (
      collaboratorId,
      collaboratorName,
      collaboratorDocument,
      objectName,
      objectDescription,
      category,
      photo,
      signature,
      notes,
      entryDate,
      entryTime,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME(), ?)
  `;

  const values = [
    collaboratorId,
    collaboratorName,
    collaboratorDocument,
    objectName,
    objectDescription,
    category,
    photo || null,
    signature || null,
    notes || null,
    'DENTRO',
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({
      id: result.insertId.toString(),
      ...req.body,
      entryDate: new Date().toISOString().split('T')[0],
      entryTime: new Date().toLocaleTimeString('es-ES'),
      status: 'DENTRO',
    });
  });
};

// ==============================
// DELETE ENTRY (CORRECTO)
// ==============================
const deleteEntry = (req, res) => {
  const { id } = req.params;

  const checkSql = 'SELECT * FROM entries WHERE id = ?';

  db.query(checkSql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No existe' });
    }

    const entry = result[0];

    if (!entry.exitDate) {
      return res.status(400).json({
        message: 'Debe registrar salida antes de eliminar',
      });
    }

    const sql = 'DELETE FROM entries WHERE id = ?';

    db.query(sql, [id], (err2) => {
      if (err2) return res.status(500).json(err2);

      res.json({ message: 'Eliminado correctamente' });
    });
  });
};

module.exports = {
  getEntries,
  createEntry,
  deleteEntry,
};