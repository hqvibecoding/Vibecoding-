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
      // Determine if it's an image or a raw file (GLB)
      // GLB files are usually uploaded as 'raw' or 'image' depending on Cloudinary config
      // But we can try to delete as image first, then raw if it fails, or just use resource_type: 'auto'
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
      res.json({ success: true, result });
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      res.status(500).json({ error: "Failed to delete from Cloudinary" });
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
