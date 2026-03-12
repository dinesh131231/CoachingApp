import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
{
  originalName: { type: String, required: true },

  // Cloudinary public id
  filename: { type: String, required: true },

  // Cloudinary file URL
  url: { type: String, required: true },

  size: { type: Number, required: true },

  mimetype: { type: String },

  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfo"
  },

  questionId: {
    type: Number,
    required: false
  }

},
{
  timestamps: true,
  collection: "files"
}
);

export default mongoose.model("File", fileSchema);




// import mongoose from 'mongoose';

// const fileSchema = new mongoose.Schema({
//   originalName: { type: String, required: true },
//   filename: { type: String, required: true },
//   path: { type: String, required: true },
//   size: { type: Number, required: true },
//   mimetype: { type: String },
//   uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'userinfo' },
//   questionId: { type: Number, required: false },
//   createdAt: { type: Date, default: Date.now },
// }, { collection: 'files' });

// export default mongoose.model('File', fileSchema);
