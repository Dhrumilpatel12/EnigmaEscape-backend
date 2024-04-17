import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    activities: {
      type: String,
      required: true,
    },
    food: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
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

export default mongoose.model("Categories", CategoriesSchema);