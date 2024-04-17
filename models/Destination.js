import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    desc: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    }, 
  },
  { timestamps: true }
);

export default mongoose.model("Destination", DestinationSchema);