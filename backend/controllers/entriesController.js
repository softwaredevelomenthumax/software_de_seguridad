const db = require('../db');

const getEntries = (req, res) => {
  db.query(
    'SELECT * FROM entries ORDER BY id DESC',
    (err, results) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(results);
      }
    }
  );
};

const createEntry = (req, res) => {
  const {
    collaboratorName,
    collaboratorDocument,
    objectName,
    objectDescription,
    category,
    notes,
  } = req.body;

  const sql = `
    INSERT INTO entries (
      collaboratorName,
      collaboratorDocument,
      objectName,
      objectDescription,
      category,
      notes,
      entryDate,
      entryTime,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURTIME(), ?)
  `;

  db.query(
    sql,
    [
      collaboratorName,
      collaboratorDocument,
      objectName,
      objectDescription,
      category,
      notes,
      'DENTRO',
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        res.json({
          message: 'Ingreso registrado',
        });
      }
    }
  );
};

module.exports = {
  getEntries,
  createEntry,
};