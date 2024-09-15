import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function client({ client, messages, notifications }) {
    if (messages) {
        client.messages = { create: messages }
        if (messages.length > 1) {
            await prisma.message.deleteMany({ where: { clientId: client.id } })
        }
    }
    if (notifications) {
        client.notifications = { create: notifications }
    }
    console.log(JSON.stringify(client))
    try {
        const result = await prisma.client.upsert(
            {
                create: client,
                update: client,
                where: { id: client.id }
            }
        )
        return result
    } catch (e) {
        console.log(e)
        return undefined
    }
}

export async function clients() {
    try {
        const result = await prisma.client.findMany(
            {
                include: {
                    messages: true,
                    notifications: true,
                    requests: true,
                    logs: true
                }
            }
        )
        return result
    } catch (e) {
        console.log(e)
        return undefined
    }
}

export async function request({ request, data }) {
    if (data) {
        request.data = { create: data }
    }
    try {
        const result = await prisma.request.create(
            {
                data: request,
            }
        )
        return result
    } catch (e) {
        console.log(e)
        return undefined
    }
}

export async function requests(clientId) {
    try {
        const result = await prisma.request.findMany(
            {
                where: { clientId: clientId, completed: false },
                include: { data: true }
            }
        )
        if (result) {
            await prisma.request.updateMany(
                {
                    where: { clientId: clientId },
                    data: { completed: true }
                }
            )
        }
        return result
    } catch (e) {
        console.log(e)
        return undefined
    }
}

export async function log(clientId, message) {
    const log = {
        message: message,
        clientId: clientId
    }
    try {
        const result = await prisma.log.create(
            {
                data: log
            }
        )
        return result
    } catch (e) {
        console.log(e)
        return undefined
    }
}