import { useEffect, useState } from "react";
import { apiRequest } from "./services/api";
import { connectSocket } from "./services/socket";
import "./styles/global.css";

export default function App() {
  const [health, setHealth] = useState(null);
  const [socketStatus, setSocketStatus] = useState("connecting...");

  useEffect(() => {
    apiRequest("/health")
      .then((data) => setHealth(data))
      .catch((err) => setHealth({ error: err.message }));
  }, []);

  useEffect(() => {
    const socket = connectSocket();
    socket.on("connect", () => setSocketStatus(`connected (${socket.id})`));
    socket.on("disconnect", () => setSocketStatus("disconnected"));
    socket.on("connect_error", (err) =>
      setSocketStatus(`error: ${err.message}`),
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="smoke-test">
      <h1>Chat App — Skeleton</h1>
      <section>
        <h2>REST check</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </section>
      <section>
        <h2>Socket check</h2>
        <pre>{socketStatus}</pre>
      </section>
    </div>
  );
}
