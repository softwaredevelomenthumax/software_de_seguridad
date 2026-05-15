const db = require('../db');

// =====================================
// REGISTRAR SALIDA
// =====================================
const registerExit = async (req, res) => {
  try {

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'ID requerido',
      });
    }

    await db.query(
      `
      UPDATE entries
      SET
        status = 'FUERA',
        exitDate = CURDATE(),
        exitTime = CURTIME()
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message: 'Salida registrada correctamente',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// ELIMINAR REGISTRO
// =====================================
const deleteEntry = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      `
      DELETE FROM entries
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message: 'Eliminado correctamente',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// EXPORTS
// =====================================
module.exports = {
  registerExit,
  deleteEntry,
};