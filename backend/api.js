import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./userdetail.js";
import express from "express";
import path from "path";
import File from "./models/File.js";
import Notice from "./models/Notice.js";
import Link from "./models/Link.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";


// NOTICE ENDPOINTS

// Create a new notice
// app.post("/notices", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text || !text.trim()) {
//       return res.status(400).json({ success: false, message: "Notice text is required" });
//     }
//     const notice = new Notice({ text });
//     await notice.save();
//     res.status(201).json({ success: true, notice });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// Get all notices
// app.get("/notices", async (req, res) => {
//   try {
//     const notices = await Notice.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, notices });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Delete a notice by ID
// app.delete("/notices/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Notice.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "Notice not found" });
//     }
//     res.json({ success: true, message: "Notice deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });
import cors from "cors";
// import fs from "fs";

const user = userModel;
// const app = express();

// app.use(cors());
// app.use(express.json());

//store uplode file
// const storage = multer.diskStorage({
//   destination:  (req, file, cb) =>{
//     cb(null,'uploads/')
//   },
//   filename: (req, file, cb) =>{
//     cb(null,file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname) )
//   }
// })
// const upload = multer({storage:storage});

// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   res.json({
//     message: "File uploaded successfully",
//     file: req.file.filename,
//   });
// });


export const setupRoutes = (app) => {


  

  // POST endpoint for user and admin signup
  app.post("/signup", async (req, res) => {
    try {
      const { firstName, lastName, email, password, role, adminKey } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields"
        });
      }

      // Check if user already exists
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email"
        });
      }

      // Validate admin role and admin key
      if (role === 'admin') {
        if (!adminKey) {
          return res.status(400).json({
            success: false,
            message: "Admin key is required for admin registration"
          });
        }
        // Validate admin key
        const validAdminKey = process.env.ADMIN_SECRET_KEY;
        if (adminKey !== validAdminKey) {
          return res.status(403).json({
            success: false,
            message: "Invalid admin key"
          });
        }
      }

      // Hash the password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create new user object
      const newUser = new user({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        role,
      });

      // Save user to database
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: `${role === 'admin' ? 'Admin' : 'User'} registered successfully`,
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        }

      });
      console.log("New user registered:", newUser)

    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  });

  // POST endpoint for user login
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password"
        });
      }

      // Find user by email
      const foundUser = await user.findOne({ email });
      if (!foundUser) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      // Validate password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      // Issue JWT
      
      const token = jwt.sign(
        {
          id: foundUser._id,
          email: foundUser.email,
          role: foundUser.role
        },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '2d' }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: foundUser._id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          role: foundUser.role
        }
      });

    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  });

    // GET all files (id + path)
    app.get("/files", async (req, res) => {
      try {
        const files = await File.find({}, { f_id: 1, url: 1, originalName: 1 });

        res.status(200).json({
          success: true,
          data: files,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });
    //GET ALL G LINKS

    app.get("/Links", async (req, res) => {
      try {
        const links = await Link.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, links });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });


    // Delete a link by ID
    app.delete("/Links", async (req, res) => {
      try {
        const { id } = req.params;
        const deleted = await Link.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ success: false, message: "Link not found" });
        }
        res.json({ success: true, message: "Link deleted" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

app.delete("/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // delete from Cloudinary
    await cloudinary.uploader.destroy(file.filename, {
      resource_type: "raw", // needed for pdf, doc etc
    });

    // delete from MongoDB
    await file.deleteOne();

    res.json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


    // app.delete("/files/:id", async (req, res) => {
    //   try {
    //     const file = await File.findById(req.params.id);

    //     if (!file) {
    //       return res.status(404).json({ success: false, message: "File not found" });
    //     }

    //     // delete from disk
    //     if (fs.existsSync(file.path)) {
    //       fs.unlinkSync(file.path);
    //     }

    //     // delete from db
    //     await file.deleteOne();

    //     res.json({ success: true, message: "File deleted" });
    //   } catch (err) {
    //     res.status(500).json({ success: false, message: err.message });
    //   }
    // });

    // notices delete
    app.get("/notices", async (req, res) => {
      try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, notices });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // Delete a notice by ID
    app.delete("/notices/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const deleted = await Notice.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ success: false, message: "Notice not found" });
        }
        res.json({ success: true, message: "Notice deleted" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });


}