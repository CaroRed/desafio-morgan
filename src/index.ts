import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import http from "node:http";
import { Server } from "socket.io";
import { globalMiddleware } from "./middlewares/global.middleware";
import routerUser from "./routes/user.route";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // permitir todas las conexiones
    },
});



// 1 y 2 Configuración de los middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

// static files
app.use(express.static("public"));


server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

const chat = io.of("/chat");

chat.on("connection", (socket) => {
    console.log("New connection", socket.id);

    // rooms
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

});

