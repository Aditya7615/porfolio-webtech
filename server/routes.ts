import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { contactMessageSchema } from "@shared/schema";
import { sendEmail } from "./services/email";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = contactMessageSchema.parse(req.body);
      
      // Save message to MySQL database
      const message = await storage.saveContactMessage(validatedData);
      
      // Auto-generated "Thank You" message logic with Resume Link
      const autoReplyParams = {
        to: validatedData.email,
        from: "adityagoyal447@gmail.com", 
        subject: "Thanks for reaching out - Aditya Goyal",
        text: `Hi ${validatedData.name},\n\nThank you for reaching out! I have received your message and will get back to you as soon as possible.\n\nAs requested, you can find my resume here: https://drive.google.com/file/d/1P0T8snDYE0APvkDkoPAt53IrFUdg-RqD/view\n\nBest regards,\nAditya Goyal`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <p>Hi <strong>${validatedData.name}</strong>,</p>
            <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
            <p>As you requested, I've attached my resume link below for your reference:</p>
            <div style="margin: 25px 0;">
              <a href="https://drive.google.com/file/d/1P0T8snDYE0APvkDkoPAt53IrFUdg-RqD/view" 
                 style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                 View My Resume
              </a>
            </div>
            <p>Best regards,<br><strong>Aditya Goyal</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
            <p style="font-size: 0.8em; color: #777;">This is an automated response from my portfolio contact form.</p>
          </div>
        `
      };

      // Send the email in the background so the user doesn't have to wait
      sendEmail(autoReplyParams).catch((error) => {
        console.error("Failed to send auto-reply email:", error);
      });
      
      // Return success response immediately after DB save
      return res.status(200).json({
        success: true,
        message: "Contact message received and resume sent",
        data: { id: message.id },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        });
      }
      
      console.error("Error handling contact message:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}