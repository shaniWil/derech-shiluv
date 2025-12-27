import mongoose, { Schema, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const VolunteerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        profession: {
            type: String,
            required: true,
        },
        experienceYears: {
            type: Number,
            default: 0,
        },
        placesOfWork: {
            type: String,
        },
        placesOfstudy: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        comments: {
            type: String,       
        },
    },
  {
    timestamps: true,
  }
);

// models.Volunteer מונע יצירה כפולה ב-Hot Reload
export default models.Volunteer ||
  mongoose.model("Volunteer", VolunteerSchema);


