import mongoose from 'mongoose';

const userDetailSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
 
}, { collection: "userinfo" });

export default mongoose.model('userinfo', userDetailSchema);