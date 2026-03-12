import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";


dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {

    

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "tution_uploads",
        
        resource_type: "auto",
        // allows pdf, image, doc etc
      },
      (error, result) => {
        if (result) {
          console.log("FULL RESULT:", result); // ✅ add this
          console.log("URL:", result.secure_url);
          console.log("RESOURCE TYPE:", result.resource_type);
          console.log(result.secure_url); // ✅ move inside callback
          resolve(result);
        } else {
          console.log("ERROR:", error);
          reject(error);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default uploadToCloudinary;