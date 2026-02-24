import express from "express";
import { createServer as createViteServer } from "vite";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dj8ge55xe",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Cloudinary Deletion
  app.post("/api/cloudinary/delete", async (req, res) => {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ error: "Public ID is required" });
    }

    try {
      if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ 
          error: "Cloudinary Configuration Missing", 
          details: "Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in AI Studio Secrets." 
        });
      }

      // Try deleting as image first (most common for thumbnails)
      let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      
      // If not found or failed, try as raw (common for GLB files)
      if (result.result !== 'ok') {
        result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      }

      console.log(`Cloudinary delete result for ${publicId}:`, result);
      res.json({ success: true, result });
    } catch (error: any) {
      console.error("Cloudinary delete error:", error);
      res.status(500).json({ 
        error: "Failed to delete from Cloudinary", 
        details: error?.message || String(error) 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "dist" });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
