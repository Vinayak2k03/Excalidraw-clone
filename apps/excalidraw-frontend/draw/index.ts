import { connect } from "node:net";

export function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set initial canvas background color
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    console.log(e.clientX, e.clientY);
  });

  // Handle mouse move event
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      // Clear the canvas to remove previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas background color to black
      ctx.fillStyle = "rgba(0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the rectangle with white stroke
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}