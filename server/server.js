const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname+'/..', 'public')));

// Gérer toutes les autres routes en redirigeant vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/..', 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
