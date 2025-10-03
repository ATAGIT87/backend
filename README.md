# backend# Backend – Signup & Signin with DynamoDB

## Overview
This is the **backend part** of the project.  
It is built with **Node.js, TypeScript, Express, and AWS DynamoDB**.  
It provides REST API endpoints for user authentication.

---

## Project Structure
backend/
src/
app.ts # Express setup
routes/authRoutes.ts # Routes for signup & signin
controllers/authController.ts # Business logic
services/awsService.ts # DynamoDB integration
package.json
tsconfig.json


---

## Features
- `POST /auth/signup` → Saves a new user into DynamoDB.
- `POST /auth/signin` → Validates user credentials.
- Uses AWS DynamoDB as the database.
- Environment variables used for config (set in Render or local `.env`):
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
DYNAMODB_TABLE=your-table-name



---

## Scripts
- `npm run dev` → Run with ts-node (development).
- `npm run build` → Compile TypeScript to `dist/`.
- `npm start` → Run compiled app (`dist/app.js`).

---

## Deployment
- Deploy on [Render](https://render.com).
- Build Command: `npm run build`
- Start Command: `npm start`
- Exposed service URL (example):  
https://backend-xxxx.onrender.com