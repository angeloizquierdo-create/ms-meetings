import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

// Lee las credenciales desde una variable de entorno en producción
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log('✅ Firebase Admin inicializado desde variable de entorno.');
    } catch (e) {
        console.error('Error al parsear FIREBASE_SERVICE_ACCOUNT:', e);
        process.exit(1);
    }
} else {
    // Carga el archivo local para desarrollo
    try {
        const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
        console.log('✅ Firebase Admin inicializado desde archivo local (desarrollo).');
    } catch (e) {
        console.error('No se encontró serviceAccountKey.json para desarrollo ni la variable de entorno FIREBASE_SERVICE_ACCOUNT para producción.', e);
        process.exit(1);
    }
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

export default db;