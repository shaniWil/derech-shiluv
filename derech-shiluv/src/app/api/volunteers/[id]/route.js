import { connectToDatabase } from "@/src/lib/db";
import Volunteer from "@/models/Volunteer";
import mongoose from "mongoose";

export async function GET(_request, { params }) {
    try {

        await connectToDatabase();

        const { id } = params;

        // Checks whether the given ID is in a valid format of mongoose.
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.json(
                { error: "Invalid volunteer ID" },
                { status: 400 } // Bad Request from the first place
            );
        }

        const volunteer = await Volunteer.findById(id).select(
            "name email phone profession experienceYears placeOfWork placeOfStudy isActive comments createdAt updatedAt"
        );

        if (!volunteer) {
            return Response.json(
                {error: "Volunteer not found"},
                {status: 404} // valid request but resource not found
            );
        }

        return Response.json(volunteer, { status: 200 });


    } catch (error) {
        console.error("GET volunteer by ID error:", error);
        return Response.json(
            {error:"failed to fetch volunteer"},
            {status: 500}
        );

    }
}
