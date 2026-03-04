import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  slug: string;
  region: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  gallery: string[];
  attractions: string[];
  bestTimeToVisit: string;
  activities: string[];
  altitude: string;
  temperature: string;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [500, 'Short description cannot exceed 500 characters']
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required']
    },
    mainImage: {
      type: String,
      required: [true, 'Main image is required']
    },
    gallery: [{
      type: String
    }],
    attractions: [{
      type: String
    }],
    bestTimeToVisit: {
      type: String
    },
    activities: [{
      type: String
    }],
    altitude: {
      type: String
    },
    temperature: {
      type: String
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Create slug from name before saving
DestinationSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = (this.name as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model<IDestination>('Destination', DestinationSchema);

