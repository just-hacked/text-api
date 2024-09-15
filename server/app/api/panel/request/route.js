import { request, log } from "@/database/database"

export async function POST(req) {
    const data = await req.json()
    const result = await request(data)
    if (result) {
        await log(data.request.clientId, "New request is waiting on the list for the client")
        return Response.json(result)
    } else {
        return Response('Error', { status: 400 })
    }
}