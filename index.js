import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import chalk from 'chalk';
import userRouter from './src/routes/userRoute.js';
import chatRouter from './src/routes/chatRoute.js';
import messageRouter from './src/routes/messageRoute.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './src/config/swagger.js';
import fs from 'fs';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import {initSocket} from './src/socket/socket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:5173', 'https://chat-with-vunn.netlify.app'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   },
//   transports: ['websocket', 'polling'], // Cho phép cả WebSocket & Polling
// });

// Middleware để parse JSON
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// Kết nối MongoDB
connectDB();

// Enable CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://chat-with-vunn.netlify.app', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Nếu gửi cookie, token
  }),
);

const customCss = fs.readFileSync(process.cwd() + '/swagger-ui.css', 'utf8');
// Tích hợp Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {customCss}));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

app.get('/check-heath', (req, res) => {
  res.send('Hello, server is running');
});

app.get('/', (req, res) => {
  res.send('Hello!!!');
});

//socket
initSocket(server);

server.listen(PORT, () => {
  console.log(chalk.blue(`Server is running on http://localhost:${PORT}`));
});
