
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routers/auth';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const swaggerPath = path.join(process.cwd(), "src", "swagger", "openApi.yaml");
const swaggerDocument = YAML.load(swaggerPath);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.get("/api-docs/openApi.yaml", (req, res) => {
  res.sendFile(swaggerPath);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes
app.use('/api/auth', authRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
