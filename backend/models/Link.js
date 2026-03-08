import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  lname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'links' });

export default mongoose.model('Link', linkSchema);
