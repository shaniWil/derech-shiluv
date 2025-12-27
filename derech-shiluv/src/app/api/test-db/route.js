import { connectToDatabase } from "@/src/lib/db";

export async function GET() {
    await connectToDatabase();
    return new Response("Connected to the database successfully");
}