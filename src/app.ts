import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http"; // برای socket.io
import { Server } from "socket.io";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import authRoutes from "./routers/auth";

// 📘 مسیر فایل Swagger YAML
const swaggerPath = path.join(process.cwd(), "src", "swagger", "openApi.yaml");
const swaggerDocument = YAML.load(swaggerPath);

const app = express();
const server = http.createServer(app); // ایجاد سرور HTTP مشترک با express
const io = new Server(server, {
  cors: {
    origin: "*", // در محیط واقعی باید فقط دامنه خودت باشه
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// 🧩 Middlewareها
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

// 💬 Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  
  socket.on("chatMessage", (msg) => {
    console.log("💬 Message received:", msg);
    
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

console.log(`📄 Swagger UI available at http://localhost:${PORT}/api-docs`);