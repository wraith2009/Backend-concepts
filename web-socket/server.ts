import http from "http";
import crypto from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import net from "net";

// websocket opcodes
const OPC = {
  CONT: 0x0,
  TEXT: 0x1,
  BIN: 0x2,
  CLOSE: 0x8,
  PING: 0x9,
  PONG: 0xa,
};

const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

// function parseFrame(buffer, onFrame){
// will implement this after understanding 
// }

// HTTP/1.1 server with WS Upgrade
const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(404);
    res.end("Use WebSocket upgrade");
  }
);

server.on("upgrade", (req: IncomingMessage, socket, head) => {
  //  Basic handshake checks
  const upgrade = (req.headers.upgrade || "").toLowerCase();
  const connection = (req.headers.connection || "").toLowerCase();
  const key = req.headers["sec-websocket-key"];
  const version = req.headers["sec-websocket-version"];
  const ok =
    upgrade === "websocket" &&
    connection.split(/,\s*/).includes("upgrade") &&
    key &&
    version === "13";

  if (!ok) {
    // raw tcp socket
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.destroy();
    return;
  }

  // compute Sec-Websocket-Accept
  const accept = crypto
    .createHash("sha1")
    .update(key + WS_GUID)
    .digest("base64");

  const responseHeaders = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-Websocket-Accept: ${accept}`,
    "\r\n",
  ];
  socket.write(responseHeaders.join("\r\n"));
  (socket as net.Socket).setNoDelay(true);
});

const PORT = 8090;
server.listen(PORT, () => {
  console.log(`HTTP/1.1 Ws server on ws://localhost:${PORT}`);
});
