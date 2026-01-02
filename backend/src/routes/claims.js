// // const express = require('express');
// // const router = express.Router();
// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');
// // const { PrismaClient } = require('@prisma/client');
// // const auth = require('../middleware/auth');

// // const prisma = new PrismaClient();

// // // --- CONFIGURATION UPLOAD ---
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const dir = path.join(__dirname, '../../uploads');
// //     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// //     cb(null, dir);
// //   },
// //   filename: (req, file, cb) => {
// //     const name = file.originalname.split(' ').join('_');
// //     cb(null, Date.now() + '-' + name);
// //   }
// // });

// // const upload = multer({ storage: storage });

// // // --- ROUTES ---

// // // 1. GET (Récupérer les dossiers)
// // router.get('/', auth, async (req, res) => {
// //   try {
// //     let whereClause = {};

// //     // Si c'est un CLIENT, il ne voit que SES dossiers
// //     if (req.user.role === 'CLIENT') {
// //       whereClause = { userId: req.user.userId };
// //     }

// //     const claims = await prisma.claim.findMany({
// //       where: whereClause,
// //       include: { 
// //         user: { select: { full_name: true, email: true } } 
// //       },
// //       // CORRECTION ICI : created_at au lieu de createdAt
// //       orderBy: { created_at: 'desc' } 
// //     });
    
// //     res.json(claims);
// //   } catch (error) {
// //     console.error("Erreur GET /claims:", error);
// //     res.status(500).json({ error: "Erreur serveur lors de la récupération" });
// //   }
// // });

// // // 2. POST (Créer un dossier)
// // router.post('/', auth, upload.single('document'), async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ error: "Le document PDF est obligatoire" });
// //     }

// //     const claim = await prisma.claim.create({
// //       data: {
// //         userId: req.user.userId,
// //         policy_number: req.body.policy_number,
// //         description: req.body.description,
// //         incident_date: new Date(req.body.incident_date).toISOString(),
// //         claim_amount: parseFloat(req.body.claim_amount),
        
// //         // CORRECTION ICI : document_path (selon ton log d'erreur)
// //         document_path: req.file.filename, 
        
// //         status: 'ANALYZING'
// //       }
// //     });
    
// //     res.status(201).json(claim);
// //   } catch (error) {
// //     console.error("Erreur POST /claims:", error);
// //     res.status(500).json({ error: "Erreur serveur: " + error.message });
// //   }
// // });

// // // 3. PUT (Mise à jour Agent)
// // router.put('/:id', auth, async (req, res) => {
// //   try {
// //     const { status } = req.body;
    
// //     if (req.user.role !== 'AGENT') {
// //       return res.status(403).json({ error: "Accès refusé" });
// //     }

// //     const updated = await prisma.claim.update({
// //       where: { id: req.params.id},
// //       data: { status }
// //     });
    
// //     res.json(updated);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Erreur mise à jour" });
// //   }
// // });

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const axios = require('axios'); // Nécessaire pour parler à l'IA
// const { PrismaClient } = require('@prisma/client');
// const auth = require('../middleware/auth');

// const prisma = new PrismaClient();

// // --- CONFIGURATION UPLOAD ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, '../../uploads');
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     // Nettoyage du nom de fichier pour éviter les erreurs
//     const name = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
//     cb(null, Date.now() + '-' + name);
//   }
// });

// const upload = multer({ storage: storage });

// // --- ROUTES ---

// // 1. GET (Récupérer les dossiers)
// router.get('/', auth, async (req, res) => {
//   try {
//     let whereClause = {};

//     // Si c'est un CLIENT, il ne voit que SES dossiers
//     if (req.user.role === 'CLIENT') {
//       whereClause = { userId: req.user.userId };
//     }

//     const claims = await prisma.claim.findMany({
//       where: whereClause,
//       include: { 
//         user: { select: { full_name: true, email: true } } 
//       },
//       orderBy: { created_at: 'desc' } 
//     });
    
//     res.json(claims);
//   } catch (error) {
//     console.error("Erreur GET /claims:", error);
//     res.status(500).json({ error: "Erreur serveur lors de la récupération" });
//   }
// });

// // 2. POST (Créer un dossier + Analyse IA)
// router.post('/', auth, upload.single('document'), async (req, res) => {
//   try {
//     // 1. Vérification fichier
//     if (!req.file) {
//       return res.status(400).json({ error: "Le document justificatif est obligatoire" });
//     }

//     // 2. Récupération des données du formulaire React
//     const { 
//       policy_number, 
//       incident_date, 
//       incident_type, 
//       collision_type, 
//       incident_severity, 
//       authorities_contacted, 
//       claim_amount, 
//       description,
//       city 
//     } = req.body;

//     // 3. Préparation des données pour l'IA Python
//     // On remplit les champs manquants avec des valeurs par défaut ou logiques
//     const aiPayload = {
//       policy_number: policy_number || "UNKNOWN",
//       incident_date: incident_date || new Date().toISOString().split('T')[0],
//       incident_type: incident_type || "Single Vehicle Collision",
//       collision_type: collision_type || "Front Collision",
//       incident_severity: incident_severity || "Minor Damage",
//       authorities_contacted: authorities_contacted || "None",
//       total_claim_amount: parseFloat(claim_amount) || 0,
//       description: description || "Pas de description",
      
//       // Champs techniques requis par le modèle (valeurs simulées si non présentes)
//       months_as_customer: 24, 
//       age: 35, 
//       policy_state: "OH", 
//       policy_csl: "250/500", 
//       policy_deductable: 1000, 
//       insured_sex: "MALE", 
//       insured_education_level: "MD", 
//       insured_occupation: "tech-support", 
//       insured_hobbies: "reading", 
//       insured_relationship: "husband", 
//       capital_gains: 0, 
//       capital_loss: 0, 
//       vehicle_claim: parseFloat(claim_amount) || 0, // Souvent proche du total
//       auto_make: "Saab", 
//       auto_model: "92x", 
//       auto_year: 2010, 
//       property_damage: "NO", 
//       bodily_injuries: 0, 
//       witnesses: 1, 
//       police_report_available: authorities_contacted === 'Police' ? "YES" : "NO", 
//       policy_bind_date: "2020-01-01"
//     };

//     console.log("🤖 Envoi vers IA:", aiPayload.policy_number);

//     // 4. Appel de l'IA (avec gestion d'erreur pour ne pas bloquer la création)
//     let aiDecision = "PENDING";
//     let aiScore = 0;
//     let aiExplanation = "En attente d'analyse";

//     try {
//       // Assure-toi que ton serveur Python tourne sur le port 8000
//       const aiResponse = await axios.post('http://localhost:8000/analyze', aiPayload);
      
//       if (aiResponse.data) {
//         aiDecision = aiResponse.data.decision;   // "APPROVE", "REJECT", "FURTHER_REVIEW"
//         aiScore = aiResponse.data.total_score || 0;
//         aiExplanation = aiResponse.data.explanation || "";
//         console.log(`✅ IA Réponse: ${aiDecision} (Score: ${aiScore})`);
//       }
//     } catch (aiError) {
//       console.error("⚠️ L'IA n'est pas disponible, dossier créé en attente.");
//       // On continue, le dossier sera créé mais sans score IA
//     }

//     // 5. Mapping du statut IA vers Statut Base de données
//     let dbStatus = 'ANALYZING'; // Par défaut
//     if (aiDecision === 'APPROVE') dbStatus = 'VALIDATED';
//     if (aiDecision === 'REJECT') dbStatus = 'REJECTED';
//     // Si FURTHER_REVIEW, on laisse ANALYZING ou on met IN_PROGRESS

//     // 6. Sauvegarde dans PostgreSQL via Prisma
//     const newClaim = await prisma.claim.create({
//       data: {
//         userId: req.user.userId,
//         policy_number: policy_number,
//         description: description,
//         incident_date: new Date(incident_date).toISOString(),
//         claim_amount: parseFloat(claim_amount),
//         document_path: req.file.filename,
        
//         // Nouveaux champs IA
//         status: dbStatus,
//         ai_score: parseFloat(aiScore), 
//         ai_analysis: aiExplanation 
//       }
//     });
    
//     res.status(201).json(newClaim);

//   } catch (error) {
//     console.error("Erreur POST /claims:", error);
//     res.status(500).json({ error: "Erreur serveur: " + error.message });
//   }
// });

// // 3. PUT (Mise à jour Agent)
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (req.user.role !== 'AGENT') {
//       return res.status(403).json({ error: "Accès refusé" });
//     }

//     const updated = await prisma.claim.update({
//       where: { id: req.params.id},
//       data: { status } // L'agent peut écraser la décision de l'IA
//     });
    
//     res.json(updated);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erreur mise à jour" });
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const axios = require('axios'); 
// const { PrismaClient } = require('@prisma/client');
// const auth = require('../middleware/auth');

// const prisma = new PrismaClient();

// // --- 1. CONFIGURATION UPLOAD (Robustesse améliorée) ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Utilise process.cwd() pour être sûr d'être à la racine du projet
//     const dir = path.join(process.cwd(), 'uploads');
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     // Nettoie le nom du fichier (garde l'extension)
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
//     cb(null, `${Date.now()}-${name}${ext}`);
//   }
// });

// const upload = multer({ storage: storage });

// // --- ROUTES ---

// // 2. GET (Récupérer les dossiers)
// router.get('/', auth, async (req, res) => {
//   try {
//     let whereClause = {};

//     // Sécurité : Un client ne voit que SES dossiers
//     if (req.user.role === 'CLIENT') {
//       whereClause = { userId: req.user.userId };
//     }

//     const claims = await prisma.claim.findMany({
//       where: whereClause,
//       include: { 
//         user: { select: { full_name: true, email: true } } // On récupère le nom du client
//       },
//       orderBy: { created_at: 'desc' } 
//     });
    
//     res.json(claims);
//   } catch (error) {
//     console.error("Erreur GET /claims:", error);
//     res.status(500).json({ error: "Impossible de récupérer les dossiers." });
//   }
// });

// // 3. POST (Création + IA + Sauvegarde complète)
// router.post('/', auth, upload.single('document'), async (req, res) => {
//   try {
//     // A. Validation de base
//     if (!req.file) {
//       return res.status(400).json({ error: "Le document justificatif est obligatoire." });
//     }

//     // B. Extraction et Nettoyage des données (req.body arrive en String via FormData)
//     const { 
//       policy_number, 
//       incident_date, 
//       incident_type, 
//       collision_type, 
//       incident_severity, 
//       authorities_contacted, 
//       claim_amount, 
//       description,
//       city 
//     } = req.body;

//     const amountFloat = parseFloat(claim_amount);

//     // C. Préparation du Payload pour l'IA Python
//     // Note: On simule les données client manquantes (age, sexe, etc.) pour que le modèle XGBoost fonctionne
//     const aiPayload = {
//       // Données réelles du formulaire
//       policy_number: policy_number || "UNKNOWN",
//       incident_date: incident_date || new Date().toISOString().split('T')[0],
//       incident_type: incident_type || "Single Vehicle Collision",
//       collision_type: collision_type || "Front Collision",
//       incident_severity: incident_severity || "Minor Damage",
//       authorities_contacted: authorities_contacted || "None",
//       total_claim_amount: amountFloat || 0,
//       description: description || "",
//       city: city || "Unknown",

//       // Données simulées (Mock) pour satisfaire le modèle IA si elles ne sont pas dans le formulaire
//       months_as_customer: 36, 
//       age: 42, 
//       policy_state: "OH", 
//       policy_csl: "250/500", 
//       policy_deductable: 1000, 
//       insured_sex: "MALE", 
//       insured_education_level: "PhD", 
//       insured_occupation: "exec-manager", 
//       insured_hobbies: "reading", 
//       insured_relationship: "wife", 
//       capital_gains: 0, 
//       capital_loss: 0, 
//       vehicle_claim: amountFloat || 0, 
//       auto_make: "Audi", 
//       auto_model: "A5", 
//       auto_year: 2018, 
//       property_damage: "NO", 
//       bodily_injuries: 0, 
//       witnesses: 1, 
//       police_report_available: authorities_contacted === 'Police' ? "YES" : "NO", 
//       policy_bind_date: "2015-01-01"
//     };

//     console.log("📤 Envoi à l'IA...", aiPayload.policy_number);

//     // D. Appel à l'API Python (IA)
//     let aiStatus = 'ANALYZING'; // Statut par défaut
//     let aiScore = 0;
//     let aiAnalysis = "Analyse en cours...";

//     try {
//       const aiResponse = await axios.post('http://localhost:8000/analyze', aiPayload);
      
//       if (aiResponse.data) {
//         // --- CORRECTION ICI ---
//         // 1. Gérer l'imbrication { claim: ... } ou directe
//         const dataObj = aiResponse.data.claim || aiResponse.data;

//         // 2. Utiliser les bons noms de clés (ceux du Python)
//         aiScore = parseFloat(dataObj.total_score) || 0;
//         aiAnalysis = dataObj.ai_analysis || "Analyse indisponible."; 
        
//         // --- LOGIQUE METIER (Seuils 0.2 et 0.8) ---
//         if (aiScore < 0.2) {
//             // Risque très faible -> Validation automatique
//             aiStatus = 'VALIDATED';
            
//             // Si pas de texte renvoyé pour les cas valides, on en met un par défaut
//             if (!aiAnalysis || aiAnalysis === "Analyse indisponible.") {
//                 aiAnalysis = "✅ Dossier validé automatiquement (Risque très faible détecté).";
//             }
//             console.log(`✅ Auto-Validation (Score sûr: ${aiScore})`);

//         } else if (aiScore > 0.8) {
//             // Risque très élevé -> Rejet automatique
//             aiStatus = 'REJECTED';
//             console.log(`🚨 Auto-Rejet (Risque élevé: ${aiScore})`);
//         } else {
//             // Entre 0.2 et 0.8 -> Zone grise, l'agent doit décider
//             aiStatus = 'ANALYZING';
//             console.log(`🤔 Zone de doute (${aiScore}) -> Envoi à l'agent.`);
//         }
//       }
//     } catch (aiError) {
//       console.error("⚠️ Serveur IA injoignable. Le dossier sera créé en statut 'ANALYZING'.");
//       // On ne bloque pas la création, on continue simplement sans les données IA
//     }

//     // E. Sauvegarde dans PostgreSQL via Prisma
//     // C'est ici qu'on map TOUS les champs du frontend vers la BDD
//     const newClaim = await prisma.claim.create({
//       data: {
//         userId: req.user.userId,
        
//         // Champs Standards
//         policy_number,
//         description,
//         incident_date: new Date(incident_date), // Conversion String -> Date Object
//         claim_amount: isNaN(amountFloat) ? 0 : amountFloat,
//         document_path: req.file.filename,
        
//         // Nouveaux Champs (Ceux qu'on a ajoutés au Schema)
//         incident_type,
//         collision_type,
//         incident_severity,
//         authorities_contacted,
//         city,

//         // Champs IA
//         status: aiStatus,
//         ai_score: aiScore, // On stocke le float (ex: 0.35)
//         ai_analysis: aiAnalysis
//       }
//     });

//     res.status(201).json(newClaim);

//   } catch (error) {
//     console.error("❌ Erreur POST /claims:", error);
//     res.status(500).json({ error: "Erreur serveur lors de la création du dossier." });
//   }
// });

// // 4. PUT (Mise à jour par l'Agent uniquement)
// router.put('/:id', auth, async (req, res) => {
//   try {
//     // Seul un AGENT peut modifier le statut manuellement
//     if (req.user.role !== 'AGENT') {
//       return res.status(403).json({ error: "Accès réservé aux agents." });
//     }

//     const { status } = req.body;

//     const updatedClaim = await prisma.claim.update({
//       where: { id: req.params.id },
//       data: { status }
//     });
    
//     res.json(updatedClaim);
//   } catch (error) {
//     console.error("Erreur PUT /claims:", error);
//     res.status(500).json({ error: "Erreur lors de la mise à jour." });
//   }
// });
// // 4. PUT (Mise à jour du statut + modification de l'analyse IA si rejet)
// router.put('/:id', auth, async (req, res) => {
//   try {
//     // A. Sécurité : Seul un AGENT peut modifier
//     if (req.user.role !== 'AGENT') {
//       return res.status(403).json({ error: "Accès refusé. Réservé aux agents." });
//     }

//     // B. Récupération des paramètres
//     const { id } = req.params;
//     const { status, ai_analysis } = req.body;

//     // C. Mise à jour dynamique dans la Base de Données
//     const updatedClaim = await prisma.claim.update({
//       where: { id: id },
//       data: {
//         status: status,
//         // Astuce Javascript :
//         // Si 'ai_analysis' contient du texte (ex: motif du rejet), on met à jour le champ.
//         // Si 'ai_analysis' est null ou vide, cette ligne ne fait rien (on garde l'ancienne valeur).
//         ...(ai_analysis && { ai_analysis: ai_analysis })
//       }
//     });
    
//     // D. Réponse succès
//     res.json(updatedClaim);

//   } catch (error) {
//     // E. Gestion complète des erreurs
//     console.error("❌ Erreur PUT /claims/:id :", error);

//     // Si Prisma ne trouve pas l'ID (Code P2025)
//     if (error.code === 'P2025') {
//         return res.status(404).json({ error: "Dossier introuvable." });
//     }

//     // Erreur générique
//     res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); 
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// --- 1. CONFIGURATION UPLOAD ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${Date.now()}-${name}${ext}`);
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 2. GET (Récupérer les dossiers)
router.get('/', auth, async (req, res) => {
  try {
    let whereClause = {};

    // Sécurité : Un client ne voit que SES dossiers
    if (req.user.role === 'CLIENT') {
      whereClause = { userId: req.user.userId };
    }

    const claims = await prisma.claim.findMany({
      where: whereClause,
      include: { 
        user: { select: { full_name: true, email: true } }
      },
      orderBy: { created_at: 'desc' } 
    });
    
    res.json(claims);
  } catch (error) {
    console.error("Erreur GET /claims:", error);
    res.status(500).json({ error: "Impossible de récupérer les dossiers." });
  }
});

// 3. POST (Création + IA + Sauvegarde complète)
router.post('/', auth, upload.single('document'), async (req, res) => {
  try {
    // A. Validation de base
    if (!req.file) {
      return res.status(400).json({ error: "Le document justificatif est obligatoire." });
    }

    // B. Extraction des données
    const { 
      policy_number, incident_date, incident_type, collision_type, 
      incident_severity, authorities_contacted, claim_amount, description, city 
    } = req.body;

    const amountFloat = parseFloat(claim_amount);

    // C. Préparation Payload IA
    const aiPayload = {
      policy_number: policy_number || "UNKNOWN",
      incident_date: incident_date || new Date().toISOString().split('T')[0],
      incident_type: incident_type || "Single Vehicle Collision",
      collision_type: collision_type || "Front Collision",
      incident_severity: incident_severity || "Minor Damage",
      authorities_contacted: authorities_contacted || "None",
      total_claim_amount: amountFloat || 0,
      description: description || "",
      city: city || "Unknown",
      // Mocks pour XGBoost
      months_as_customer: 36, age: 42, policy_state: "OH", policy_csl: "250/500", 
      policy_deductable: 1000, insured_sex: "MALE", insured_education_level: "PhD", 
      insured_occupation: "exec-manager", insured_hobbies: "reading", 
      insured_relationship: "wife", capital_gains: 0, capital_loss: 0, 
      vehicle_claim: amountFloat || 0, auto_make: "Audi", auto_model: "A5", 
      auto_year: 2018, property_damage: "NO", bodily_injuries: 0, witnesses: 1, 
      police_report_available: authorities_contacted === 'Police' ? "YES" : "NO", 
      policy_bind_date: "2015-01-01"
    };

    console.log("📤 Envoi à l'IA...", aiPayload.policy_number);

    // D. Appel IA
    let aiStatus = 'ANALYZING';
    let aiScore = 0;
    let aiAnalysis = "Analyse en cours...";

    try {
      const aiResponse = await axios.post('http://localhost:8000/analyze', aiPayload);
      
      if (aiResponse.data) {
        const dataObj = aiResponse.data.claim || aiResponse.data;
        aiScore = parseFloat(dataObj.total_score) || 0;
        aiAnalysis = dataObj.ai_analysis || "Analyse indisponible."; 
        
        if (aiScore < 0.2) {
            aiStatus = 'VALIDATED';
            if (!aiAnalysis || aiAnalysis === "Analyse indisponible.") {
                aiAnalysis = "✅ Dossier validé automatiquement (Risque très faible).";
            }
            console.log(`✅ Auto-Validation (Score: ${aiScore})`);
        } else if (aiScore > 0.8) {
            aiStatus = 'REJECTED';
            console.log(`🚨 Auto-Rejet (Score: ${aiScore})`);
        } else {
            aiStatus = 'ANALYZING';
            console.log(`🤔 Zone de doute (${aiScore})`);
        }
      }
    } catch (aiError) {
      console.error("⚠️ Serveur IA injoignable.");
    }

    // E. Sauvegarde BDD
    const newClaim = await prisma.claim.create({
      data: {
        userId: req.user.userId,
        policy_number, description,
        incident_date: new Date(incident_date),
        claim_amount: isNaN(amountFloat) ? 0 : amountFloat,
        document_path: req.file.filename,
        incident_type, collision_type, incident_severity, 
        authorities_contacted, city,
        status: aiStatus,
        ai_score: aiScore,
        ai_analysis: aiAnalysis
      }
    });

    res.status(201).json(newClaim);

  } catch (error) {
    console.error("❌ Erreur POST /claims:", error);
    res.status(500).json({ error: "Erreur serveur création dossier." });
  }
});

// 4. PUT (Mise à jour statut + Texte Agent)
// ✅ C'EST LA SEULE VERSION DU PUT MAINTENANT
router.put('/:id', auth, async (req, res) => {
  try {
    // A. Sécurité
    if (req.user.role !== 'AGENT') {
      return res.status(403).json({ error: "Accès refusé. Réservé aux agents." });
    }

    // B. Récupération
    const { id } = req.params;
    const { status, ai_analysis } = req.body;

    // Logs pour vérifier ce qui arrive
    console.log(`📝 UPDATE Claim ${id} -> Status: ${status}`);
    if (ai_analysis) console.log(`📝 Texte modifié reçu : ${ai_analysis.substring(0, 30)}...`);

    // C. Update BDD
    const updatedClaim = await prisma.claim.update({
      where: { id: id },
      data: {
        status: status,
        // Si ai_analysis est présent, on met à jour, sinon on touche pas
        ...(ai_analysis && { ai_analysis: ai_analysis })
      }
    });
    
    res.json(updatedClaim);

  } catch (error) {
    console.error("❌ Erreur PUT /claims/:id :", error);
    if (error.code === 'P2025') return res.status(404).json({ error: "Dossier introuvable." });
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
  }
});

module.exports = router;