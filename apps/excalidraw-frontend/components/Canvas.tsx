import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "line";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game,setGame]=useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

  useEffect(()=>{
    game?.setTool(selectedTool);
  },[selectedTool,game])

  useEffect(() => {
    if (canvasRef.current) {
      const g=new Game(canvasRef.current,roomId,socket);
      setGame(g);

      return()=>{
        g.destroy();
      }
    }
  }, [canvasRef]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} width={2000} height={1000}></canvas>
      <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
  );
}

function Topbar({
  setSelectedTool,
  selectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div className='flex fixed top-2 justify-center items-center w-full'
    >
      <div className="flex gap-2">
        <IconButton
          icon={<RectangleHorizontalIcon />}
          onClick={() => setSelectedTool("rect")}
          activated={selectedTool === "rect"}
        />
        <IconButton
          icon={<Circle />}
          onClick={() => setSelectedTool("circle")}
          activated={selectedTool === "circle"}
        />
        <IconButton
          icon={<Pencil />}
          onClick={() => setSelectedTool("line")}
          activated={selectedTool === "line"}
        />
      </div>
    </div>
  );
}
