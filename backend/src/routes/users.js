const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const SECRET = "SECRET_KEY_TEMPORAIRE"; // Doit être la même que dans auth.js

// 1. INSCRIPTION
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        full_name,
        role: role || 'CLIENT' // Par défaut CLIENT
      }
    });
    res.status(201).json({ message: "Compte créé !", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Cet email est déjà utilisé." });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Utilisateur inconnu" });

    // Vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Mot de passe incorrect" });

    // Génération du Token
    // Le payload { userId, role } doit correspondre à ce qu'on lit dans auth.js
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        full_name: user.full_name, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

module.exports = router;