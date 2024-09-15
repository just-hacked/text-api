import { clients } from "@/database/database";

export async function GET(req) {
    const data = await clients()
    if (data) {
        return Response.json(data)
    } else {
        return Response('Error', { status: 400 })
    }
}