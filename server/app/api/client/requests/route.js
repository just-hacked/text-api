import { requests, log } from "@/database/database"

export async function POST(req) {
    const data = await req.json()
    console.log(data);
    if (!data.id) {
        return Response('Error', { status: 400 })
    }
    const result = await requests(data.id)
    if (result) {
        await log(data.id, "Client received the requests update. Wating for respone...")
        return Response.json(result)
    } else {
        return Response('Error', { status: 400 })
    }
}