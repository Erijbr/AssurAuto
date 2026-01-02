# 🛡️ Système de Gestion de Sinistres (Insurance Claims System)

Une application Full Stack moderne permettant la digitalisation complète du processus de déclaration de sinistres. Le système utilise l'IA (OCR) pour aider les assurés à remplir leurs dossiers et offre aux agents une interface de gestion efficace.



## 🌟 Fonctionnalités Principales

### 👤 Espace Client (Assuré)
* **Authentification Sécurisée** : Inscription et connexion via JWT.
* **OCR Intelligent (Tesseract.js)** : Analyse automatique des factures ou constats pour pré-remplir :
    * Le montant du sinistre.
    * La date de l'incident.
    * La description (via analyse de texte).
* **Numéro de Police Auto** : Génération automatique d'un identifiant unique (`POL-TIMESTAMP-RANDOM`).
* **Upload de Justificatifs** : Envoi sécurisé de fichiers (PDF, JPG, PNG).
* **Suivi en Temps Réel** : Tableau de bord avec statuts (En attente, Validé, Rejeté).

### 🕵️ Espace Agent (Assureur)
* **Vue Globale** : Accès à l'ensemble des réclamations de la base de données.
* **Traitement** : Possibilité de télécharger les justificatifs et de changer le statut des dossiers.

---

## 🛠️ Stack Technique

### Frontend
* **Framework** : React.js
* **Styling** : Tailwind CSS
* **Icônes** : Lucide React
* **HTTP Client** : Axios
* **OCR** : Tesseract.js
* **Notifications** : React Hot Toast

### Backend
* **Runtime** : Node.js
* **Framework** : Express.js
* **Base de Données** : PostgreSQL
* **ORM** : Prisma
* **Gestion Fichiers** : Multer
* **Auth** : JSON Web Token (JWT) & Bcrypt

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :
1.  **Node.js** (v16+)
2.  **PostgreSQL** (et un outil comme pgAdmin).

---

## 🚀 Installation et Démarrage

Le projet est divisé en deux parties (Frontend et Backend) qui doivent tourner simultanément.

### 🔵 Partie 1 : Backend (API & Base de données)

1.  **Naviguer dans le dossier backend :**
    ```bash
    cd backend
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install requirements.txt
    
    ```

3.  **Configurer l'environnement :**
    Créez un fichier `.env` à la racine du dossier `backend`.
    Adaptez le mot de passe (`********`) selon votre installation PostgreSQL locale.

    ```env
    # Remplacez 'postgres' (user) et '********' (password) par vos infos locales
    DATABASE_URL="postgresql://postgres:********@localhost:5432/claims_db?schema=public"
    ```

4.  **Préparer Prisma (Important) :**
    Ouvrez le fichier `backend/prisma/schema.prisma` et assurez-vous que le provider est bien sur postgresql :
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```

5.  **Initialiser la Base de Données :**
    * Créez d'abord une base de données vide nommée `claims_db` via pgAdmin ou SQL Shell.
    * Lancez la migration :
    ```bash
    npx prisma migrate dev --name init
    ```

6.  **Lancer le serveur :**
    ```bash
    npm start
    ```
    > Le serveur écoute sur : `http://localhost:5000`

---

### 🟢 Partie 2 : Frontend (Interface Utilisateur)

Ouvrez un **nouveau terminal** (ne fermez pas celui du backend).

1.  **Naviguer dans le dossier frontend :**
    ```bash
    cd frontend
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Lancer l'application :**
    ```bash
    npm start
    ```
    > L'application s'ouvre sur : `http://localhost:3000`

---
