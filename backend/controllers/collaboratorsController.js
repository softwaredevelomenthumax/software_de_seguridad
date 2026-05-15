const db = require('../db');

// ================= GET COLLABORATORS =================
const getCollaborators = async (req, res) => {
  try {

    const [rows] = await db.query(
      `
      SELECT *
      FROM collaborators
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

// ================= CREATE COLLABORATOR =================
const createCollaborator = async (req, res) => {
  try {

    const {
      fullName,
      document,
      position,
      area,
    } = req.body;

    // VALIDACIÓN
    if (
      !fullName ||
      !document ||
      !position
    ) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO collaborators
      (
        fullName,
        document,
        position,
        area
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        fullName,
        document,
        position,
        area || '',
      ]
    );

    res.json({
      id: result.insertId,
      fullName,
      document,
      position,
      area,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getCollaborators,
  createCollaborator,
};