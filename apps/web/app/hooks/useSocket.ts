import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0NzljOTdiLTkwNmQtNDM5ZS1iZTQyLWFlODA4M2E0MmE4ZiIsImlhdCI6MTczOTA5MTg5M30.obJ6AUylvtJlELwBjecEbLECBeO3pS8bvDeMCINkyFo`
    );
    ws.onopen = () => {
      setLoading(false), setSocket(ws);
    };
  }, []);

  return { socket, loading };
}
