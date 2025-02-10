import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = await getExistingShapes(roomId);
  console.log(existingShapes);

  if (!ctx) return;

  socket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  // Handle mouse down event
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  // Handle mouse up event
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width=e.clientX-startX;
    const height=e.clientY-startY;

    const shape:Shape={
        type:"rect",
        x:startX,
        y:startY,
        width,
        height
    }
    existingShapes.push(shape);

    socket.send(JSON.stringify({
        type:"chat",
        message:JSON.stringify({
            shape
        }),
        roomId
    }))
  });

  // Handle mouse move event
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      // Clear the canvas and set the background color to black
      clearCanvas(existingShapes, canvas, ctx);

      // Draw the rectangle with white stroke
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
    // clear the canvas and set the background to black
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

// render all the previous shapes in the room
  existingShapes.map((shape)=>{
    if(shape.type==='rect'){
        ctx.strokeStyle="rgba(255,255,255)"
        ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
    }
  })
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}
