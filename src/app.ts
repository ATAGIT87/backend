import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import authRoutes from "./routers/auth";

const swaggerPath = path.join(process.cwd(), "src", "swagger", "openApi.yaml");
const swaggerDocument = YAML.load(swaggerPath);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // update for production
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 📘 Swagger setup
app.get("/api-docs/openApi.yaml", (req: Request, res: Response) => {
  res.sendFile(swaggerPath);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 🔐 Auth routes
app.use("/api/auth", authRoutes);

// 🌍 Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running with Socket.IO and Swagger!");
});

// 💬 Socket.IO logic
const onlineUsers: Map<string, string> = new Map(); // socket.id -> username

io.on("connection", (socket: Socket) => {
  console.log("🟢 New client connected:", socket.id);

  // 👤 User joins
  socket.on("userJoined", (username: string) => {
    console.log(`👤 ${username} joined the chat`);
    onlineUsers.set(socket.id, username);

    // send updated user list
    io.emit("onlineUsers", Array.from(onlineUsers.values()));

    // notify everyone
    io.emit("systemMessage", `${username} joined the chat`);
  });

  // 💬 Receive and broadcast messages
  socket.on("chatMessage", (msg: { username: string; text: string }) => {
    console.log("💬 Message received:", msg);
    io.emit("chatMessage", msg);
  });

  // ❌ Disconnect
  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      console.log(`🔴 ${username} left the chat`);
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
      io.emit("systemMessage", `${username} left the chat`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📄 Swagger UI available at http://localhost:${PORT}/api-docs`);
});
