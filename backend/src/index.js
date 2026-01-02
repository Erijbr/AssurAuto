// src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// --- IMPORTS DES ROUTES ---
const claimsRouter = require('./routes/claims');
const usersRouter = require('./routes/users'); // <--- NOUVEAU : On importe les users

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares
app.use(cors()); // Accepte les requêtes de n'importe où (pour le dev)
app.use(express.json()); // Permet de lire le JSON dans req.body

// 2. Servir les fichiers uploadés (pour que le frontend puisse afficher le PDF)
// L'URL sera : http://localhost:3000/uploads/nom-du-fichier.pdf
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 3. Routes API
app.use('/api/claims', claimsRouter);
app.use('/api/users', usersRouter); // <--- NOUVEAU : On active la route /api/users

// 4. Test simple
app.get('/', (req, res) => {
  res.send('API de Gestion de Sinistres est en ligne 🚀');
});

// 5. Démarrage
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});