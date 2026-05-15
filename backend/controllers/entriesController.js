const db = require('../db');

// ================= GET ENTRIES =================
const getEntries = async (req, res) => {
  try {

    const [rows] = await db.query(
      `
      SELECT *
      FROM entries
      ORDER BY id DESC
      `
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= CREATE ENTRY =================
const createEntry = async (req, res) => {
  try {

    const now = new Date();

    // FECHA YYYY-MM-DD
    const entryDate = now.toISOString().split('T')[0];

    // HORA HH:MM:SS
    const entryTime = now.toTimeString().split(' ')[0];

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

    // VALIDACIONES
    if (
      !collaboratorId ||
      !collaboratorName ||
      !collaboratorDocument ||
      !objectName ||
      !category
    ) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO entries (
        collaboratorId,
        collaboratorName,
        collaboratorDocument,
        objectName,
        objectDescription,
        category,
        photo,
        signature,
        entryDate,
        entryTime,
        notes,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        collaboratorId,
        collaboratorName,
        collaboratorDocument,
        objectName,
        objectDescription || '',
        category,
        photo || '',
        signature || '',
        entryDate,
        entryTime,
        notes || '',
        'DENTRO',
      ]
    );

    res.json({
      id: result.insertId,
      collaboratorId,
      collaboratorName,
      collaboratorDocument,
      objectName,
      objectDescription,
      category,
      photo,
      signature,
      entryDate,
      entryTime,
      notes,
      status: 'DENTRO',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= DELETE ENTRY =================
const deleteEntry = async (req, res) => {
  try {

    await db.query(
      `
      DELETE FROM entries
      WHERE id = ?
      `,
      [req.params.id]
    );

    res.json({
      message: 'Registro eliminado',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getEntries,
  createEntry,
  deleteEntry,
};