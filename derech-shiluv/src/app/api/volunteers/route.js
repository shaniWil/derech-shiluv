import { connectToDatabase } from "@/lib/db";
import Volunteer from "@/models/Volunteer";

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function parseBooleanParam(param) {
    if (param == "true") return true;
    if (param == "false") return false;
    return null;
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
            placeOfStudy,
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

        if (experienceYears !== undefined && (typeof experienceYears !== "number" || experienceYears < 0)) {
            return Response.json(
                { error: "experience Years must be a non negative number" },
                { status: 400 }
            );
        }

        const newVolunteer = await Volunteer.create({
            name,
            email,
            phone,
            profession,
            experienceYears,
            placesOfWork,
            placeOfStudy,
            comments
        });

        return Response.json(newVolunteer, { status: 201 });
    } catch (error) {

        if (error.code === 11000) {
            return Response.json(
                { error: "A volunteer with this email already exists." },
                { status: 409 }
            );
        }

        return Response.json(
            { error: " failed to create volunteer." },
            { status: 500 }
        );
    }
}


export async function GET(request) {
    try {
        await connectToDatabase();

        // TODO: auth, only admin can see all volunteers

        const { searchParams } = new URL(request.url);

        const q = searchParams.get("q")?.trim();
        const profession = searchParams.get("profession")?.trim();
        const placeOfStudy = searchParams.get("placeOfStudy")?.trim();
        const isActiveParam = searchParams.get("isActive");
        const sort = (searchParams.get("sort") || "createdAt").trim();
        const order = (searchParams.get("order") || "desc").toLowerCase();

        // ---- filter ----
        const filter = {};

        const isActive = parseBooleanParam(isActiveParam);
        if (isActive !== null) filter.isActive = isActive;

        if (profession) filter.profession = profession;

        if (placeOfStudy) filter.placeOfStudy = placeOfStudy;

        if (q) {
            const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escaped, "i");
            filter.$or = [{ name: regex }, { profession: regex }];
        }

        // ---- sort ----
        const dir = order === "asc" ? 1 : -1;
        let sortObj = { createdAt: -1 }; 

        if (sort === "activeFirst") {
            sortObj = { isActive: -1, createdAt: -1 };
        } else {
            const allowedSortFields = new Set(["profession", "createdAt", "isActive", "name", "placeOfStudy"]);
            if (allowedSortFields.has(sort)) {
                sortObj = { [sort]: dir };
                if (sort === "isActive") sortObj.createdAt = -1;
            }
        }

        const volunteers = await Volunteer.find(filter)
            .sort(sortObj)
            .select(
                "name email phone profession experienceYears placesOfWork placeOfStudy comments isActive createdAt"
            );

        return Response.json(volunteers, { status: 200 });
    } catch (error) {
        console.error("GET /api/volunteers error:", error);
        return Response.json(
            { error: "Failed to fetch volunteers." },
            { status: 500 }
        );
    }
}
