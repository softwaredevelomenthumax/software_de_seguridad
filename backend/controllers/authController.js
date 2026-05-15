const db = require('../db');

// ================= LOGIN =================
const login = async (req, res) => {
  try {

    const { username, password } = req.body;

    const sql = `
      SELECT *
      FROM admins
      WHERE username = ?
      AND password = ?
    `;

    const [results] = await db.query(
      sql,
      [username, password]
    );

    if (results.length > 0) {
      return res.json({
        success: true,
        user: results[0],
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos',
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ================= REGISTER =================
const register = async (req, res) => {
  try {

    const {
      username,
      password,
      role,
    } = req.body;

    const sql = `
      INSERT INTO admins
      (username, password, role)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(
      sql,
      [username, password, role]
    );

    res.json({
      success: true,
      id: result.insertId,
      username,
      role,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ================= GET USERS =================
const getUsers = async (req, res) => {
  try {

    const sql = `
      SELECT id, username, role
      FROM admins
      ORDER BY id DESC
    `;

    const [results] = await db.query(sql);

    res.json(results);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  getUsers,
};