"use client"

import { Inter as Font } from "next/font/google"
import "./globals.css"
import { useStore } from "@/utils/state";
import { useEffect } from "react";

const font = Font({ subsets: ["latin"] });

export default function RootLayout({ dashboard, client }) {

    const clientId = useStore((state) => state.clientId)
    const setClientId = useStore((state) => state.setClientId)

    const data = useStore((state) => state.data)
    const setData = useStore((state) => state.setData)

    const fetchData = async () => {
        try {
            const response = await fetch('/api/panel/data');
            const result = await response.json();
            setData(result)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <html lang="en">
            <body className={`${font.className} h-screen w-full bg-neutral-900`}>
                <div className="flex fixed top-0 right-0 left-0 flex-row justify-between items-center px-5 h-14 border-b-2 bg-neutral-800">
                    <p className="text-lg font-bold text-white uppercase">{clientId ? data.find(ele => ele.id == clientId).model : "dashboard"}</p>
                    <button onClick={() => setClientId(null)} className="text-lg font-bold text-white uppercase">{clientId ? "BACK" : `CLIENTS: ${data.length}`}</button>
                </div>
                <div className="h-16"></div>
                {clientId ? client : dashboard}
            </body>
        </html>
    );
}
