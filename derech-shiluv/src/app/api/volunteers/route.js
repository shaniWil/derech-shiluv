import { connectToDatabase } from "@/lib/db";
import Volunteer from "@/models/Volunteer";

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const {
            name,
            email,
            phone,
            profession,
            experienceYears,
            placesOfWork,
            placesOfstudy,
            comments
        } = body;

        if (!name || !email || !profession) {
            return Response.json(
                { error: "name, email and profession are required" },
                { status: 400 }
            );
        }

        if (typeof name != "string" || typeof profession != "string") {
            return Response.json(
                { error: "name and profession must be strings" },
                { status: 400 }
            );
        }

        if (phone && typeof phone !== "string") {
            return Response.json(
                { error: "phone must be a string" },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return Response.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        if (experienceYears && typeof experienceYears !== "number" || experienceYears < 0) {
            return Response.json(
                { error: "experience Years must be a non negative number" },
                { status: 400 }
            );
        }

        const newVolunteer = new Volunteer.create({
            name,
            email,
            phone,
            profession,
            experienceYears,
            placesOfWork,
            placesOfstudy,
            comments
        });

        return Response.json(newVolunteer, { status: 201 });
    } catch (error) {

        if (error.code === 11000) {
            return Response.json(
                { error: "A volunteer with this email already exists." },
                { status: 400 }
            );
        }

        return Response.json(
            { error: " failed to create volunteer." },
            { status: 500 }
        );
    }
}




