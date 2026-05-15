const express = require('express');
const router = express.Router();

const db = require('../db');

// ================= REGISTRAR SALIDA =================
router.post('/', async (req, res) => {
  try {

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID es requerido',
      });
    }

    const now = new Date();

    // Formato compatible MySQL (IMPORTANTE)
    const exitDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // MySQL TIME requiere HH:MM:SS (sin a.m / p.m)
    const exitTime = now.toTimeString().split(' ')[0];

    const status = 'SALIDA';

    const [result] = await db.query(
      `
      UPDATE entries
      SET
        exitDate = ?,
        exitTime = ?,
        status = ?
      WHERE id = ?
      `,
      [
        exitDate,
        exitTime,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Salida registrada correctamente',
      exitDate,
      exitTime,
      status,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Error registrando salida',
      error: error.message,
    });
  }
});

module.exports = router;