"use client"

import { useStore } from "@/utils/state"
import { useState } from "react"

export default function Dashboard() {

    const data = useStore((state) => state.data);
    const setClientId = useStore((state) => state.setClientId);
    const [search, setSearch] = useState("");

    // Filter the data based on the search input
    const filteredData = search
        ? data.filter(item => item.model.toLowerCase().includes(search.toLowerCase()))
        : data;

    return (
        <main className="flex flex-col gap-5 p-5 w-full h-screen">
            <input
                onChange={(e) => setSearch(e.target.value)}
                className="p-5 text-white bg-transparent rounded-md border-2"
                placeholder="Search"
                value={search}
            />
            {filteredData.map((item, index) => (
                <button
                    onClick={() => setClientId(item.id)}
                    key={index}
                    className="flex flex-col items-start p-5 w-full rounded-md border-2"
                >
                    <p className="text-xl font-bold text-white uppercase">{item.model}</p>
                    <p className="text-lg text-white">number: {item.number}</p>
                    <p className="text-lg text-white">last update: {item.update}</p>
                    <div className="grid grid-cols-2 gap-y-2 mt-5 w-full italic font-bold text-center md:w-max">
                        <p className="text-lg text-white">messages: {item.messages.length}</p>
                        <p className="text-lg text-white">notifications: {item.notifications.length}</p>
                        <p className="text-lg text-white">requests: {item.requests.length}</p>
                        <p className="text-lg text-white">logs: {item.logs.length}</p>
                    </div>
                </button>
            ))}
        </main>
    );
}