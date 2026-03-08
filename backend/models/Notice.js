import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'notices' });

export default mongoose.model('Notice', noticeSchema);
