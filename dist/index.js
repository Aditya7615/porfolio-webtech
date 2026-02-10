var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contactMessageSchema: () => contactMessageSchema,
  contactMessages: () => contactMessages,
  insertContactMessageSchema: () => insertContactMessageSchema,
  users: () => users
});
import { mysqlTable, text, serial, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var contactMessages = mysqlTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().onUpdateNow()
});
var contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required")
});
var insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  message: true
});
var users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull()
});

// server/db.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in your .env file.");
}
var poolConnection = mysql.createPool(process.env.DATABASE_URL);
var db = drizzle(poolConnection, { schema: schema_exports, mode: "default" });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async saveContactMessage(message) {
    const [contactMessage] = await db.insert(contactMessages).values(message).returning();
    return contactMessage;
  }
  async getContactMessages() {
    return await db.select().from(contactMessages);
  }
  async getContactMessageById(id) {
    const [contactMessage] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return contactMessage;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactMessageSchema.parse(req.body);
      const message = await storage.saveContactMessage(validatedData);
      return res.status(200).json({
        success: true,
        message: "Contact message received",
        data: { id: message.id }
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      }
      console.error("Error handling contact message:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  // Ensure index.html is inside /client
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  const port = 5001;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
