"use client"

import { useStore } from "@/utils/state"
import { useState } from "react";

export default function Client() {

    const clientId = useStore((state) => state.clientId)
    const data = useStore((state) => state.data)
    const client = data.find(ele => ele.id == clientId)

    const [messageExpand, setMessageExpand] = useState(false)
    const [notificationExpand, setNotificationExpand] = useState(false)
    const [requestExpand, setRequestExpand] = useState(false)
    const [logsExpand, setLogsExpand] = useState(false)

    const [number, setNumber] = useState("")
    const [text, setText] = useState("")


    const requestSendMessage = async () => {
        try {
            const response = await fetch('/api/panel/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ request: { request: "sendMessage", clientId: client.id }, data: [{ key: "number", value: number }, { key: "text", value: text }] }),
            });

            if (response.ok) {
                alert('Data submitted successfully!');
            } else {
                alert('Failed to submit data.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data.');
        }
    };

    const requestMessages = async () => {
        try {
            const response = await fetch('/api/panel/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ request: { request: "getMessages", clientId: client.id }, data: [] }),
            });

            if (response.ok) {
                alert('Data submitted successfully!');
            } else {
                alert('Failed to submit data.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data.');
        }
    }

    return (
        <main className="flex flex-col gap-5 p-5 w-full h-screen">
            <div className="flex flex-col gap-5 items-center p-5 w-full font-bold text-white rounded-md border-2">
                <p className="w-full text-white">NUMBER: {client && client.number}</p>
                <p className="w-full text-white">LAST UPDATE: {client && client.number}</p>
                <p className="w-full text-white">IP: {client && client.ip}</p>
                <p className="w-full text-white">TIME ZONE: {client && client.zone}</p>
            </div>
            <div className="flex flex-col gap-5 items-center p-5 w-full text-white rounded-md border-2">
                <p className="text-lg font-bold text-white">SEND MESSAGEG</p>
                <input onChange={(e) => setNumber(e.target.value)} placeholder="number" className="p-5 w-full h-10 rounded-md border-2 bg-neutral-800 md:max-w-72"></input>
                <input onChange={(e) => setText(e.target.value)} placeholder="text" className="p-5 w-full h-10 rounded-md border-2 bg-neutral-800 md:max-w-72"></input>
                <button onClick={requestSendMessage} className="p-1.5 w-full font-bold text-black bg-white rounded-md border-2 md:max-w-72">SEND</button>
            </div>
            <div className="flex flex-col gap-5 items-center p-5 w-full text-white rounded-md border-2">
                <p className="text-lg font-bold text-white">REQUEST ALL MESSAGES</p>
                <button onClick={requestMessages} className="p-1.5 w-full font-bold text-black bg-white rounded-md border-2 md:max-w-72">REQUEST</button>
            </div>
            <div className="flex flex-col gap-3 p-5 w-full text-white rounded-md border-2">
                <button onClick={() => setMessageExpand(!messageExpand)} className="flex flex-row gap-2 items-center font-bold uppercase max-w-fit">
                    <img className={`size-8 ${messageExpand && 'rotate-180'} transition-all`} src="/arrow-down.svg" />
                    Messages
                </button>
                <div className={`flex flex-col gap-5 w-full ${!messageExpand && 'hidden'}`}>
                    {client && client.messages.map((item, index) => (
                        <div key={index} className="p-5 w-full rounded-md bg-neutral-700">
                            <p className="font-bold">{item.from}</p>
                            <p>{item.text}</p>
                            <p className="text-xs text-end opacity-65">{item.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3 p-5 w-full text-white rounded-md border-2">
                <button onClick={() => setNotificationExpand(!notificationExpand)} className="flex flex-row gap-2 items-center font-bold uppercase max-w-fit">
                    <img className={`size-8 ${notificationExpand && 'rotate-180'} transition-all`} src="/arrow-down.svg" />
                    Notifications
                </button>
                <div className={`flex flex-col gap-5 w-full ${!notificationExpand && 'hidden'}`}>
                    {client && client.notifications.map((item, index) => (
                        <div key={index} className="p-5 w-full rounded-md bg-neutral-700">
                            <p className="font-bold">{item.title}</p>
                            <p>{item.text}</p>
                            <p className="text-xs text-end opacity-65">{item.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3 p-5 w-full text-white rounded-md border-2">
                <button onClick={() => setRequestExpand(!requestExpand)} className="flex flex-row gap-2 items-center font-bold uppercase max-w-fit">
                    <img className={`size-8 ${requestExpand && 'rotate-180'} transition-all`} src="/arrow-down.svg" />
                    Requests
                </button>
                <div className={`flex flex-col gap-5 w-full ${!requestExpand && 'hidden'}`}>
                    {client && client.requests.map((item, index) => (
                        <div key={index} className="p-5 w-full rounded-md bg-neutral-700">
                            <p className="font-bold">{item.request}</p>
                            <p className="">{item.completed ? "Comleated" : "On quaue"}</p>
                            <p className="text-xs text-end opacity-65">{item.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3 p-5 w-full text-white rounded-md border-2">
                <button onClick={() => setLogsExpand(!logsExpand)} className="flex flex-row gap-2 items-center font-bold uppercase max-w-fit">
                    <img className={`size-8 ${logsExpand && 'rotate-180'} transition-all`} src="/arrow-down.svg" />
                    Logs
                </button>
                <div className={`flex flex-col gap-5 w-full ${!logsExpand && 'hidden'}`}>
                    {client && client.logs.map((item, index) => (
                        <div key={index} className="p-5 w-full rounded-md bg-neutral-700">
                            <p className="">{item.message}</p>
                            <p className="text-xs text-end opacity-65">{item.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}