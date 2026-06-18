import mongoose, { Schema, models } from 'mongoose';

const PackageSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  highlight: Boolean,
  isActive: { type: Boolean, default: true },
});

const ServiceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_en: String,
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  category: { 
    type: String, 
    enum: ['games', 'apps', 'subs', 'social', 'cards', 'balance'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  packages: [PackageSchema],
}, { timestamps: true });

export default models.Service || mongoose.model('Service', ServiceSchema);