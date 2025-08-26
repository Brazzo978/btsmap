const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db');
const config = require('../config');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken, authorizeRole('admin'));

router.get('/', (req, res) => {
  db.all('SELECT id, username, email, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

router.post('/', async (req, res) => {
  const { username, email, role } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashed = await bcrypt.hash(tempPassword, 10);
    db.run(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashed, role || 'user'],
      function (err) {
        if (err) return res.status(500).json({ error: 'User exists' });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config.smtp.user,
            pass: config.smtp.pass,
          },
        });

        const welcomeUrl = `${req.protocol}://${req.get('host')}/welcome?u=${encodeURIComponent(username)}&p=${tempPassword}`;
        transporter.sendMail({
          from: config.smtp.user,
          to: email,
          subject: 'Benvenuto in BTSMAP',
          text: `Ciao ${username},\n\nIl tuo account è stato creato.\n\nCredenziali di accesso:\nUsername: ${username}\nPassword: ${tempPassword}\n\nVisita ${welcomeUrl} per accedere.\nTi consigliamo di cambiare la password dopo il primo accesso.`,
        });

        res.status(201).json({ id: this.lastID, username, email, role: role || 'user' });
      }
    );
  } catch (e) {
    res.status(500).json({ error: 'Creation failed' });
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  });
});

module.exports = router;
