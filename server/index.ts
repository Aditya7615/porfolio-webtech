import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeEmailService } from "./services/email";
import cors from "cors";

app.use(cors({
  origin: [
    "https://your-portfolio-name.vercel.app", // Your live frontend URL
    "http://localhost:5173"                 // Keep local development working
  ],
  credentials: true
}));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

// ... existing imports and middleware

// Location: /Users/adityagoyal/work/portfolio-main-main/server/index.ts

// ... (existing code)
// Location: /Users/adityagoyal/work/portfolio-main-main/server/index.ts

(async () => {
  // 1. Initialize services
  initializeEmailService(); 
  // Inside your (async () => { ... }) block
  initializeEmailService();

  // 2. Register API routes BEFORE Vite setup
  const server = await registerRoutes(app);

  // 3. Error handling middleware for the database
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // 4. Vite setup for development mode
  if (app.get("env") === "development") {
    await setupVite(app, server); // This connects React to your Express backend
  } else {
    serveStatic(app);
  }

  // 5. Start listening on port 5001
  const port = 5001;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();