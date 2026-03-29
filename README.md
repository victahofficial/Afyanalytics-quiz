# Flamingo Website

This repository contains the source code for the Flamingo website, split into a Node.js/Express backend and a React/Vite frontend.

## Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **npm**: Comes with Node.js. Used to install packages.
- **Database**: A database compatible with Prisma (e.g., PostgreSQL or MySQL).

---

## 🚀 Installation & Setup

You will need to install the dependencies for both the frontend and backend separately. 

### 1. Backend Setup
The backend is built with Node.js, Express, and Prisma ORM.

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory based on your database configuration.
4. Set up the database with Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Note: If you have an existing database dump, you can restore from the `database.sql` file located in the root folder).*

### 2. Frontend Setup
The frontend is built with React, Vite, and TailwindCSS.

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory if there are frontend-specific environment variables (e.g., API URLs).

---

## 🏃‍♂️ Running the Site (Development)

To run the application locally, you'll need two terminal windows running simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```
*(This will start the backend server using nodemon for auto-reloading.)*

**Terminal 2: Start the Frontend App**
```bash
cd frontend
npm run dev
```
*(This will start the Vite development server. It will provide a local URL, usually `http://localhost:5173`, which you can open in your browser.)*

---

## 📦 Building for Production

When you are ready to deploy the application, you need to build the frontend and set up the backend for a production environment.

**Build the Frontend:**
```bash
cd frontend
npm run build
```
*(This command bundles your React app into static files in the `frontend/dist` directory. Depending on your hosting provider, you can serve these files via a CDN, Nginx, or straight from the backend.)*

**Run the Backend in Production:**
```bash
cd backend
npm start
```
*(This starts the Node server normally without the development overhead.)*
