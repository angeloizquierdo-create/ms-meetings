import express from 'express';
import morgan from 'morgan';
import corsMiddleware from './middleware/cors.js';
import MeetingRouter from './modules/meetings/routes/meeting.route.js';
import ParticipantRouter from './modules/participants/routes/participant.route.js';
import RatingRouter from './modules/ratings/routers/rating.router.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.meeting_path = '/ms/v1/meeting';
        this.participant_path = '/ms/v1/participant';
        this.rating_path = '/ms/v1/rating';

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(corsMiddleware);
        this.app.use(morgan('dev'));
    }

    routes() {
        this.app.use(this.meeting_path, MeetingRouter);
        this.app.use(this.participant_path, ParticipantRouter);
        this.app.use(this.rating_path, RatingRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`👾 I'M ALIVE => PORT: ${this.port}`);
        });
    }
}

export default Server;
