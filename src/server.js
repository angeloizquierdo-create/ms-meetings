
import express from 'express';
import morgan from 'morgan';
import corsMiddleware from './middleware/cors.js';
import MeetingRouter from './modules/meetings/routes/meeting.route.js';
import ParticipantRouter from './modules/participants/routes/participant.route.js';
import RatingRouter from './modules/ratings/routers/rating.router.js';
import UserRouter from './modules/users/routers/user.route.js';
import HealthRouter from './modules/health/routes/health.routes.js'; // 1. Importar la nueva ruta

class Server {
    constructor() {
        this.app = express();
        // Usar el puerto de la variable de entorno o 3000 como fallback
        this.port = process.env.PORT || 3000;

        this.meeting_path = '/ms/v1/meeting';
        this.participant_path = '/ms/v1/participant';
        this.rating_path = '/ms/v1/rating';
        this.user_path = '/ms/v1/user';
        this.health_path = '/ms/v1/health'; // 2. Definir el path para la nueva ruta

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(corsMiddleware);
        this.app.use(morgan('dev'));
    }

    routes() {
        // Ruta raíz para el Health Check de Render
        this.app.get('/', (req, res) => {
            res.status(200).json({ status: 'ok', message: 'API is alive!' });
        });

        this.app.use(this.meeting_path, MeetingRouter);
        this.app.use(this.participant_path, ParticipantRouter);
        this.app.use(this.rating_path, RatingRouter);
        this.app.use(this.user_path, UserRouter);
        this.app.use(this.health_path, HealthRouter); // 3. Usar la nueva ruta
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`👾 I'M ALIVE => PORT: ${this.port}`);
        });
    }
}

export default Server;
