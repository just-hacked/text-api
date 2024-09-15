import { client, log } from "@/database/database"

export async function POST(req) {
    const data = await req.json()
    const result = await client(data)
    if (result) {
        await log(data.client.id, "New client data received")
        return Response.json(result)
    } else {
        return Response('Error', { status: 400 })
    }
}