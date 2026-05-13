const db = require('../db');

// =====================================
// REGISTRAR SALIDA
// =====================================
const registerExit = (req, res) => {
  const { id } = req.body;

  const sql = `
    UPDATE entries
    SET 
      status = 'FUERA',
      exitDate = CURDATE(),
      exitTime = CURTIME()
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({
      message: 'Salida registrada correctamente',
    });
  });
};

// =====================================
// ELIMINAR REGISTRO
// =====================================
const deleteEntry = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM entries WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({
      message: 'Eliminado correctamente',
    });
  });
};

// =====================================
// EXPORTS (UNO SOLO)
// =====================================
module.exports = {
  registerExit,
  deleteEntry,
};