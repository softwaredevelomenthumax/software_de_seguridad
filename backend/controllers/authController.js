const db = require('../db');

const login = (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  const sql = `
    SELECT * FROM admins
    WHERE username = ?
    AND password = ?
  `;

  db.query(
    sql,
    [username, password],
    (err, results) => {

      console.log(err);
      console.log(results);

      if (err) {
        return res.status(500).json({
          error: err
        });
      }

      if (results.length > 0) {
        return res.json({
          success: true,
            user: results[0]
        });
      }

      return res.status(401).json({
        success: false
      });
    }
  );
};

module.exports = {
  login,
};

const register = (req, res) => {
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

  db.query(
    sql,
    [username, password, role],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
      });
    }
  );
};

module.exports = {
  login,
  register
};

const getUsers = (req, res) => {
  const sql = `
    SELECT id, username, role
    FROM admins
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

module.exports = {
  login,
  register,
  getUsers
};
