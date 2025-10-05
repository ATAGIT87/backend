import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
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
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 📚 Swagger routes
app.get("/api-docs/openApi.yaml", (req, res) => {
  res.sendFile(swaggerPath);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 🔐 Auth routes
app.use("/api/auth", authRoutes);

// 🌍 Test route
app.get("/", (req, res) => {
  res.send("Backend is running with Socket.IO and Swagger!");
});

// -----------------------------
// 💬 Socket.IO logic
// -----------------------------

//Sache for online users
const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // User joined with username  
  socket.on("userJoined", (username: string) => {
    onlineUsers.set(socket.id, username);
    console.log(`✅ ${username} joined the chat.`);

    io.emit("systemMessage", `${username} joined the chat`);
    io.emit("onlineUsers", Array.from(onlineUsers.values())); // List of online users
  });

  // Chat message received
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  // User disconnected
  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      onlineUsers.delete(socket.id);
      console.log(`🚪 ${username} left the chat.`);
      io.emit("systemMessage", `${username} left the chat`);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

console.log(`📄 Swagger UI available at http://localhost:${PORT}/api-docs`);
