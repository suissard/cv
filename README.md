# clavier.dev - CV Interactif & Portfolio d'Automatisation

Ce projet est un CV interactif et portfolio professionnel moderne axé sur l'automatisation IA et le développement d'applications web sur-mesure. Développé avec **Vue 3**, **Vite** et agrémenté d'animations interactives.

## 🚀 Fonctionnalités

*   **Design Moderne & Futuriste** : Interface sombre de type *glassmorphism* optimisée pour le confort de lecture et l'impact visuel.
*   **Animation 3D Interactive** : Fond animé interactif basé sur un réseau de particules physiques en **Three.js** qui réagit aux mouvements de la souris.
*   **Cartes de Cas Réels Interactives** : Système de cartes recto-verso (Situation / Solution) pour illustrer les apports concrets de l'automatisation.
*   **Intégration n8n (Webhook)** :
    *   Iframe de chat intelligent pour le cadrage de projet.
    *   Formulaire de contact asynchrone connecté à un webhook de traitement de prospects.

---

## 🛠️ Stack Technique

*   **Framework** : [Vue 3](https://vuejs.org/) (Composition API, SFC)
*   **Outil de build** : [Vite](https://vite.dev/)
*   **Styles & UI** : Tailwind CSS & FontAwesome Icons
*   **Librairie 3D** : [Three.js](https://threejs.org/)

---

## 💻 Installation & Développement Local

### Prérequis

*   [Node.js](https://nodejs.org/) (Version >= 18 recommandée)
*   [npm](https://www.npmjs.com/)

### Étape 1 : Installer les dépendances

```bash
npm install
```

### Étape 2 : Lancer le serveur de développement

```bash
npm run dev
```

Le serveur de développement démarrera par défaut sur `http://localhost:5173/`.

### Étape 3 : Build de production

Pour générer le livrable optimisé dans le dossier `dist/` :

```bash
npm run build
```

---

## 🐳 Déploiement Docker

Le projet contient un `Dockerfile` configuré pour un build multi-étapes (Node.js pour compiler l'application, puis Nginx stable-alpine pour servir les fichiers statiques).

### Construire l'image Docker

```bash
docker build -t cv-portfolio .
```

### Lancer le conteneur

```bash
docker run -d -p 80:80 --name cv-portfolio-app cv-portfolio
```

L'application sera accessible sur le port `80` (ex: `http://localhost/`).
