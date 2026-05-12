const db = require('../db');

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
      res.status(500).json(err);
    } else {
      res.json({
        message: 'Salida registrada',
      });
    }
  });
};

module.exports = {
  registerExit,
};