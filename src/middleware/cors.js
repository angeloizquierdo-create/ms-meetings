import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
    process.env.ALLOWED_ORIGIN_N8N,
    process.env.ALLOWED_ORIGIN_FIREBASE_ZOOM_MANAGER_PRODUCTION,
    process.env.ALLOWED_ORIGIN_FIREBASE_ZOOM_MANAGER_PRODUCTION_ALT, // <-- AÑADIDO
    process.env.ALLOWED_ORIGIN_FIREBASE_ZOOM_MANAGER_PREVIEW,
];

const corsOptions = {
    origin: process.env.CORS_ALLOW_ALL === 'true'
        ? '*'
        : function (origin, callback) {
            // Permitir peticiones sin origen (como las de Postman o apps móviles)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`⛔ CORS bloqueado para origen no permitido: ${origin}`);
                callback(new Error('No permitido por CORS'));
            }
        },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
