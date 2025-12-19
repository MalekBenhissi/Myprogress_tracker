# 🎯 MyProgress Tracker

**MyProgress Tracker** est une application web fullstack dédiée au suivi des objectifs personnels.  
Elle permet aux utilisateurs de définir leurs objectifs, de les organiser en étapes et de suivre leur progression à travers une interface moderne et intuitive.

Ce projet a été développé dans un cadre académique afin de mettre en pratique les concepts du développement web moderne avec la stack **MERN**.

---

## ✨ Fonctionnalités principales

- 🔐 **Authentification sécurisée**
  - Inscription et connexion des utilisateurs
  - Gestion des sessions via JSON Web Tokens (JWT)

- 🎯 **Gestion des objectifs**
  - Création, modification et suppression (CRUD)
  - Organisation des objectifs par catégories
  - Personnalisation par couleurs

- 📈 **Suivi de la progression**
  - Découpage des objectifs en étapes
  - Visualisation de l’avancement

- 💻 **Interface utilisateur**
  - Design moderne
  - Interface responsive (desktop et mobile)

---

## 🏗️ Architecture & Technologies

Le projet repose sur une architecture **client–serveur**.

### Frontend
- React
- React Router
- Axios

### Backend
- Node.js
- Express.js
- API RESTful

### Base de données
- MongoDB
- Mongoose

### Sécurité
- JWT
- bcrypt

---

## 📁 Structure du projet

```text
myprogress-tracker/
├── backend/         
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └──  server.js
│
├── frontend/         
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md


