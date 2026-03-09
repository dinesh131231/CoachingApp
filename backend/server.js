import mongoose from "mongoose";
import Link from "./models/Link.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { setupRoutes } from "./api.js";
import File from "./models/File.js";
import fs from "fs";
import Notice from "./models/Notice.js";
import userModel from "./userdetail.js";




dotenv.config();

const user = userModel;
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// Setup API routes
setupRoutes(app);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null,file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname) );
  },
});

const upload = multer({ storage });



app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Save file metadata to MongoDB
    const fileDoc = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploader: req.body.uploader || null,
      questionId: req.body.questionId ? Number(req.body.questionId) : null,
    });

    await fileDoc.save();

    res.json({
      message: "File uploaded successfully",
      file: req.file.filename,
      fileId: fileDoc._id,
      
      
    });
    
  } catch (err) {
    console.error("Error saving file metadata:", err);
    res.status(500).json({ error: "Failed to save file metadata" });
  }
});
app.get("/files", async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 // NOTICE ENDPOINTS

  // Create a new notice
  app.post("/notices", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, message: "Notice text is required" });
      }
      const notice = new Notice({ text });
      await notice.save();
      res.status(201).json({ success: true, notice });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

// GOOGLE FORM LINK END POINT
app.post("/links", async (req, res) => {
  try {
    const { url, lname } = req.body;

    // Validate input
    if (!url || !url.trim() || !lname || !lname.trim()) {
      return res.status(400).json({
        success: false,
        message: "Both URL and link name (lname) are required"
      });
    }

    // Create new link document
    const newLink = new Link({ url, lname });

    // Save to database
    await newLink.save();

    

    res.status(201).json({
      success: true,
      link: newLink,
      
    });
    

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
