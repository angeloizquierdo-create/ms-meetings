import dotenv from 'dotenv';
dotenv.config();
import Server from './src/server.js';

try {
    const app = new Server();
    app.listen();
} catch (error) {
    console.error('💀 Error starting server:', error);
}
