const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base SQLite
const db = new sqlite3.Database('./participants.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données SQLite');
    // Création de la table participants si elle n'existe pas
    db.run(`CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prenom TEXT NOT NULL,
      nom TEXT NOT NULL,
      telephone TEXT NOT NULL,
      nni TEXT NOT NULL,
      wilaya TEXT NOT NULL
    )`);
  }
});

// Route pour ajouter un participant
app.post('/api/participants', (req, res) => {
  const { prenom, nom, telephone, nni, wilaya } = req.body;
  const sql = `INSERT INTO participants (prenom, nom, telephone, nni, wilaya) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [prenom, nom, telephone, nni, wilaya], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Merci pour votre soutien à l\'initiative !', id: this.lastID });
  });
});

// Route pour récupérer les stats par wilaya
app.get('/api/stats', (req, res) => {
  const sql = `SELECT wilaya, COUNT(*) as count FROM participants GROUP BY wilaya`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route pour exporter en Excel
app.get('/api/export', (req, res) => {
  const sql = `SELECT prenom, nom, telephone, nni, wilaya FROM participants`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=participants.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 