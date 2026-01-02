const jwt = require('jsonwebtoken');
const SECRET = "SECRET_KEY_TEMPORAIRE"; // Doit être identique partout !

module.exports = (req, res, next) => {
  try {
    // 1. Récupérer le token du header (Bearer ...)
    const token = req.headers.authorization.split(' ')[1];
    
    // 2. Vérifier la signature
    const decoded = jwt.verify(token, SECRET);
    
    // 3. IMPORTANT : On stocke dans req.user (standard Express)
    // C'est ici que ça bloquait avant (tu avais req.userData)
    req.user = { 
      userId: decoded.userId, 
      role: decoded.role 
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentification invalide ou expirée" });
  }
};