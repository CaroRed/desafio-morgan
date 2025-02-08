import cookieParser from "cookie-parser";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import morgan from "morgan";
import { globalMiddleware } from "./middlewares/global.middleware";
import routerUser from "./routes/user.route";

const app = express();

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

// 1 y 2 Configuración de los middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// 3. Middleware de nivel de aplicación
app.use(globalMiddleware);

app.get("/", (req, res) => {
    res.send("Hello World");
});

// 5. Declaración de las rutas
app.use("/api", routerUser);

// interface Message {
//   id: number;
//   message: string;
//   data: Date;7
// }

// 7. Denir endpoints para enviar y recibir mensajes.
const messages: string[] = [];

app.post("/message", (req, res) => {
    const { message } = req.body;
    messages.push(message);
    res.send("Message added");
});

app.get("/message", (req, res) => {
    try {
        const message = messages.shift();
        if (message) {
            return void res.send(message);
        }
        return void res.status(204).send("No content");
    } catch (error) {
        return void res.status(500).send("Internal server error");
    }
    res.status(204).send("No content");
});

// 4 y 8. Probar el middleware de errores
app.get("/error", (req, res) => {
    throw new Error("Error de ejemplo");
});

// 4 y 8. Middleware de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.status(500).send("Something broke!");
});
