"use client"

import { WS_URL } from "@/config";
import { useEffect, useState } from "react"
import Canvas from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket]=useState<WebSocket|null>(null);

    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0NzljOTdiLTkwNmQtNDM5ZS1iZTQyLWFlODA4M2E0MmE4ZiIsImlhdCI6MTczOTA5MTg5M30.obJ6AUylvtJlELwBjecEbLECBeO3pS8bvDeMCINkyFo`)

        ws.onopen=()=>{
            setSocket(ws);
            const data=JSON.stringify({
                type:"join_room",
                roomId
            })
            console.log(data)
            ws.send(data)
        }
    },[])

    if(!socket){
        return <div>
            Connecting to server...
        </div>
    }
   
   
    return <div>
        <Canvas roomId={roomId} socket={socket}/>
    </div>
}