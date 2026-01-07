import mongoose, { Schema, models } from "mongoose";

const VolunteerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
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
            min: 0,
            default: 0,
        },
        placeOfWork: {
            type: String,
        },
        placeOfStudy: {
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


