const fs = require('fs');

// Lese die Datei icon-512.png
const imagePath = 'icon-512.png';
const imageData = fs.readFileSync(imagePath);
const base64String = imageData.toString('base64');

// Erstelle die data-URL
const dataUrl = `data:image/png;base64,${base64String}`;

// Gib die data-URL aus (kopiere sie von hier)
console.log(dataUrl);

// Optional: Speichere sie in eine Datei
fs.writeFileSync('favicon-base64.txt', dataUrl);
console.log('Base64-Zeichenkette wurde in favicon-base64.txt gespeichert.');